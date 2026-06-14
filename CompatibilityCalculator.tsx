import { CalculatedChart, PsychomatrixCell } from "../types";
import { PYTHAGOREAN_CELLS_DICTIONARY } from "../data/numerologyDb";

// Helper to sum digits of a number
export function sumDigits(num: number): number {
  return String(Math.abs(num))
    .split("")
    .reduce((sum, char) => {
      const val = parseInt(char, 10);
      return isNaN(val) ? sum : sum + val;
    }, 0);
}

// Helper to reduce numbers down to 1-9, but retaining master numbers 11, 22, 33
export function reduceToMaster(num: number): number {
  let val = Math.abs(num);
  while (val > 9) {
    if (val === 11 || val === 22 || val === 33) {
      return val;
    }
    val = sumDigits(val);
  }
  return val;
}

export function calculateNumerology(birthDateStr: string): CalculatedChart {
  // birthDateStr comes in format "YYYY-MM-DD"
  const parts = birthDateStr.split("-");
  if (parts.length !== 3) {
    throw new Error("Invalid date format. Expected YYYY-MM-DD");
  }

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  // 1. Life Path Number (Число Життєвого Шляху)
  // Standard calculation: sum all digits of day + month + year, then reduce to master
  const dateDigitsSum = sumDigits(day) + sumDigits(month) + sumDigits(year);
  const lifePathNumber = reduceToMaster(dateDigitsSum);

  // 2. Birth Day Number (Число Дня Народження)
  const birthDayNumber = reduceToMaster(day);

  // 3. Destiny / Expression Number (or secondary date-based calculations)
  const destinyNumber = reduceToMaster(lifePathNumber + birthDayNumber);

  // 4. Pythagorean square worker numbers
  // Row of numbers: all digits of birthdate
  // E.g., birthdate "14061995" -> Day: 14, Month: 06, Year: 1995
  // We format numbers as strings
  const dayStr = day.toString().padStart(2, "0");
  const monthStr = month.toString().padStart(2, "0");
  const yearStr = year.toString();
  const dateStrCombined = `${dayStr}${monthStr}${yearStr}`; // e.g. "14061995"

  // First Pythagorean number: sum of all digits of birth date
  const firstNum = sumDigits(day) + sumDigits(month) + sumDigits(year); // same as dateDigitsSum

  // Second Pythagorean number: sum of digits of the first number
  const secondNum = sumDigits(firstNum);

  // Third Pythagorean number: first number minus (2 * first non-zero digit of birth day)
  const dayDigits = dayStr.split("").map((c) => parseInt(c, 10));
  const firstNonZeroDayDigit = dayDigits[0] !== 0 ? dayDigits[0] : dayDigits[1];
  const thirdNum = firstNum - 2 * (firstNonZeroDayDigit || 1);

  // Fourth Pythagorean number: sum of digits of the third number
  const fourthNum = sumDigits(thirdNum);

  // Combined character stream to count digits (1 to 9)
  // Omit '0' for the grid count
  const allNumbersStr = `${dateStrCombined}${firstNum}${secondNum}${thirdNum}${fourthNum}`;
  const charArray = allNumbersStr.split("");

  const getDigitCountString = (digit: number): { count: number; symbols: string } => {
    const count = charArray.filter((c) => c === digit.toString()).length;
    if (count === 0) {
      return { count: 0, symbols: "немає" };
    }
    return { count, symbols: digit.toString().repeat(count) };
  };

  // Construct Psychomatrix cells
  const psychomatrix: { [key: number]: PsychomatrixCell } = {};
  for (let i = 1; i <= 9; i++) {
    const { count, symbols } = getDigitCountString(i);
    const cellDict = PYTHAGOREAN_CELLS_DICTIONARY[i];
    
    // Choose the best meanings matching count
    const key = count > 5 ? 5 : count; // clip to max dictionary index (typically 3, 4 or 5)
    let meaning = cellDict.meanings[key];
    if (!meaning) {
      // Find closest fallback
      const availableKeys = Object.keys(cellDict.meanings).map(Number).sort((a,b)=>b-a);
      const fallbackKey = availableKeys.find(k => count >= k) ?? 0;
      meaning = cellDict.meanings[fallbackKey];
    }

    psychomatrix[i] = {
      num: i,
      label: cellDict.label.split(" (")[0], // Short title
      count,
      symbols,
      meaning: meaning || "Аналізується...",
    };
  }

  // Calculate grid lines (sum of counts in specific cells)
  // Row 1: 1, 4, 7 -> Will (Цілеспрямованість)
  const r1Count = psychomatrix[1].count + psychomatrix[4].count + psychomatrix[7].count;
  // Row 2: 2, 5, 8 -> Family (Сімейність)
  const r2Count = psychomatrix[2].count + psychomatrix[5].count + psychomatrix[8].count;
  // Row 3: 3, 6, 9 -> Stability (Стабільність)
  const r3Count = psychomatrix[3].count + psychomatrix[6].count + psychomatrix[9].count;

  // Col 1: 1, 2, 3 -> Self-Esteem (Самооцінка)
  const c1Count = psychomatrix[1].count + psychomatrix[2].count + psychomatrix[3].count;
  // Col 2: 4, 5, 6 -> Materialism / Fin (Матеріальний рівень)
  const c2Count = psychomatrix[4].count + psychomatrix[5].count + psychomatrix[6].count;
  // Col 3: 7, 8, 9 -> Talent / Spirit (Потенціал таланту)
  const c3Count = psychomatrix[7].count + psychomatrix[8].count + psychomatrix[9].count;

  // Diagonal 1-5-9 -> Spirituality (Духовний світ)
  const d1Count = psychomatrix[1].count + psychomatrix[5].count + psychomatrix[9].count;
  // Diagonal 3-5-7 -> Temperament (Темперамент)
  const d2Count = psychomatrix[3].count + psychomatrix[5].count + psychomatrix[7].count;

  const getLineDescription = (lineType: string, score: number): string => {
    switch (lineType) {
      case "will":
        if (score === 0) return "Повна відсутність власної ініціативи, пливе за течією.";
        if (score <= 2) return "Помірна цілеспрямованість. Людина ставить перед собою прості цілі, часто потребує стимулу ззовні.";
        if (score === 3) return "Збалансований рівень. Вміє постояти за свої цілі, але не йде по головах.";
        if (score <= 5) return "Сильна цілеспрямованість. Фокусується на головному і наполегливо долає перешкоди.";
        return "Надмірна наполегливість, де прагнення мети понад усе, часом навіть шкодить іншим сферам.";
      case "family":
        if (score === 0) return "Дуже слабкий потяг до створення родини. Індивідуаліст.";
        if (score <= 2) return "Родина сприймається спокійно. На першому місці кар'єра чи особисті цілі, але цінує затишок.";
        if (score === 3) return "Середній рівень. Бажає створити міцне гніздечко, але шукає рівноправного партнера.";
        if (score <= 5) return "Дуже висока сімейність. Для людини дім і родина — це головне джерело сили та життєвий центр.";
        return "Жертовне ставлення до родини, прагнення контролювати і опікувати кожного навколо.";
      case "stability":
        if (score <= 1) return "Тяжко пристосовується до рутини. Любить часті зміни життєвого ритму та пригод.";
        if (score <= 3) return "Збалансована стабільність. Цінує комфорт, але за потреби легко змінює звички та переїжджає.";
        if (score <= 5) return "Висока стабільність та сила звичок. Важко сприймає переміни в побуті, цінує старі зв'язки.";
        return "Педантичне прагнення до незмінності. Боїться будь-якого ризику, консерватор.";
      case "selfEsteem":
        if (score <= 2) return "Занижена самооцінка. Довіряє іншим більше, ніж собі, потребує постійного підбадьорення.";
        if (score === 3) return "Нормальна самооцінка. Знає свої слабкі та сильні сторони, адекватно сприймає критику.";
        if (score <= 5) return "Висока самооцінка. Впевненість у власній привабливості та інтелекті. Прагне яскравої ролі.";
        return "Манія величі. Завищені стандарти, людина вважає себе винятковою у всьому.";
      case "materialism":
        if (score === 0) return "Абсолютно духовна орієнтація. Гроші сприймаються суто як тимчасовий побутовий засіб.";
        if (score <= 2) return "Мало зацікавлений у накопиченні статків, важливіша творчість чи ідейна робота.";
        if (score === 3) return "Розумне поєднання духовного і матеріального. Забезпечує себе цілком комфортно.";
        if (score <= 5) return "Висока орієнтація на матеріальне благополуччя, добробут, міцне фінансове становище.";
        return "Жадоба збагачення, велика залежність від грошей та матеріальних атрибутів престижу.";
      case "talentLine":
        if (score <= 1) return "Приховані таланти, які потребують активного саморозвитку та розкопок.";
        if (score === 2) return "Середній потенціал. Талант розкривається в хобі, якщо присвятити цьому достатньо часу.";
        if (score === 3) return "Яскравий вроджений потенціал у певній творчій чи раціональній сфері.";
        if (score <= 5) return "Широкий спектр талантів. Творче осяяння, здатність творити унікальні речі.";
        return "Геній, що підтримується вищою космічною вібрацією обов'язку та місії.";
      case "spirituality":
        if (score <= 2) return "Слабкий потяг до філософії чи релігії, прагматичний і приземлений життєвий фокус.";
        if (score <= 4) return "Розвинений внутрішній світ, вірить у вищі закони всесвіту чи мораль.";
        return "Дуже висока духовність, містичний погляд на Всесвіт. Життя розглядається як духовна практика.";
      case "temperament":
        if (score === 0) return "Дуже низький темперамент. Потребує інтелектуального єднання з партнером понад усе.";
        if (score <= 2) return "Спокійний рівень сексуальної та життєвої пристрасті. Головне — емоційний контакт.";
        if (score === 3) return "Збалансований темперамент. Гарне поєднання привабливості, пристрасті та розуму.";
        if (score <= 5) return "Яскравий, вогняний темперамент. Магнетичний вплив на партнерів, імпульсивність.";
        return "Надчутливий темперамент, де сексуальність та пристрасть керують поведінкою більшу частину часу.";
      default:
        return "";
    }
  };

  return {
    birthDate: birthDateStr,
    lifePathNumber,
    birthDayNumber,
    destinyNumber,
    firstNum,
    secondNum,
    thirdNum,
    fourthNum,
    psychomatrix,
    matrixLines: {
      horizontal: {
        will: { label: "Цілеспрямованість (Рядок 1)", value: r1Count, max: 6, desc: getLineDescription("will", r1Count) },
        family: { label: "Сімейність (Рядок 2)", value: r2Count, max: 6, desc: getLineDescription("family", r2Count) },
        stability: { label: "Стабільність (Рядок 3)", value: r3Count, max: 6, desc: getLineDescription("stability", r3Count) },
      },
      vertical: {
        selfEsteem: { label: "Самооцінка (Стовпець 1)", value: c1Count, max: 6, desc: getLineDescription("selfEsteem", c1Count) },
        materialism: { label: "Побут і Матеріальність (Стовпець 2)", value: c2Count, max: 6, desc: getLineDescription("materialism", c2Count) },
        talentLine: { label: "Потенціал таланту (Стовпець 3)", value: c3Count, max: 6, desc: getLineDescription("talentLine", c3Count) },
      },
      diagonal: {
        spirituality: { label: "Духовній світ (Діагональ 1-5-9)", value: d1Count, max: 6, desc: getLineDescription("spirituality", d1Count) },
        temperament: { label: "Темперамент (Діагональ 3-5-7)", value: d2Count, max: 6, desc: getLineDescription("temperament", d2Count) },
      },
    },
  };
}

export function calculateCompatibility(date1Str: string, date2Str: string): {
  score: number;
  verdict: string;
  points: { title: string; text: string; status: "good" | "neutral" | "bad" }[];
} {
  const chart1 = calculateNumerology(date1Str);
  const chart2 = calculateNumerology(date2Str);

  const lp1 = chart1.lifePathNumber;
  const lp2 = chart2.lifePathNumber;

  // Simple compatibility points
  const points: { title: string; text: string; status: "good" | "neutral" | "bad" }[] = [];
  let score = 50;

  // 1. Life path comparison
  if (lp1 === lp2) {
    score += 15;
    points.push({
      title: "Спільна стежка (Число життєвого шляху)",
      text: `Ви обидва маєте Число Життєвого Шляху ${lp1}. Це створює неймовірне первинне взаєморозуміння, ви чудово відчуваєте мотиви одне одного, хоча можете стикатися з проявом однакових слабкостей.`,
      status: "good",
    });
  } else if ((lp1 + lp2) % 3 === 0) {
    score += 20;
    points.push({
      title: "Гармонія творчих вібрацій",
      text: `Ваші Сила Життєвої стежки (${lp1} та ${lp2}) входять у гармонічний тригон творчості. Ви чудово надихаєте одне одного у творчих та духовних сферах.`,
      status: "good",
    });
  } else if (Math.abs(lp1 - lp2) === 1) {
    score -= 10;
    points.push({
      title: "Сусідній конфлікт",
      text: `Числа ${lp1} та ${lp2} знаходяться поруч. Це може вказувати на різне сприйняття лідерства та відповідальності. Потрібно навчитися давати простір партнеру.`,
      status: "bad",
    });
  } else {
    score += 5;
    points.push({
      title: "Доповнюючі енергії",
      text: `Ваші життєві шляхи ${lp1} та ${lp2} створюють нейтральне поле. Ви різні за характером, що дозволяє вчитися один у одного та якісно доповнювати слабкі сторони партнера.`,
      status: "neutral",
    });
  }

  // 2. Temperament comparison
  const temp1 = chart1.matrixLines.diagonal.temperament.value;
  const temp2 = chart2.matrixLines.diagonal.temperament.value;
  const tempDiff = Math.abs(temp1 - temp2);

  if (tempDiff <= 1) {
    score += 15;
    points.push({
      title: "Синхронність темпераментів",
      text: `Ваш рівень внутрішньої чутливості та темпераменту має високий ступінь згоди. Ви шукаєте подібної інтенсивності у близькості та прояві почуттів.`,
      status: "good",
    });
  } else if (tempDiff >= 3) {
    score -= 15;
    points.push({
      title: "Контраст чуттєвості",
      text: `Велика різниця у темпераменті (${temp1} проти ${temp2}). Одному з партнерів може не вистачати бурхливих пристрастей, тоді як іншому потрібен цілковитий спокій та інтелект. Це виклик для порозуміння.`,
      status: "bad",
    });
  } else {
    points.push({
      title: "Гнучкі ігри пристрасті",
      text: "Помірний контраст темпераментів дозволяє тримати інтригу в союзі. Один партнер дещо пристрасніший, інший заземлює його м'яко та спокійно.",
      status: "neutral",
    });
  }

  // 3. Material level comparison
  const mat1 = chart1.matrixLines.vertical.materialism.value;
  const mat2 = chart2.matrixLines.vertical.materialism.value;
  if (mat1 >= 4 && mat2 >= 4) {
    score += 15;
    points.push({
      title: "Матеріальний тандем",
      text: "Ви обидва орієнтовані на фінансове благополуччя, затишок та тверде заземлення. Спільний бізнес чи ведення господарства будуть максимально успішними.",
      status: "good",
    });
  } else if (Math.abs(mat1 - mat2) >= 3) {
    score -= 10;
    points.push({
      title: "Різне ставлення до грошей",
      text: "Один із вас прагне міцно стояти на ногах і планувати витрати, тоді як інший летить у емпіреях і може легковажно ставитися до ресурсів. Потрібні фінансові домовленості.",
      status: "bad",
    });
  } else {
    points.push({
      title: "Збалансований бюджет",
      text: "Спільні побутові інтереси збалансовані. Ви не схильні сперечатися через дрібні життєві витрати, знаходячи золоту середину.",
      status: "neutral",
    });
  }

  // Bound score
  score = Math.max(10, Math.min(99, score));

  // Verdict selection
  let verdict = "Нейтральний союз із гарними перспективами підлаштування.";
  if (score >= 80) {
    verdict = "Чудова кармічна сумісність! Духовна та життєва синергія високого рівня. Ви буквально читаєте думки одне одного.";
  } else if (score >= 60) {
    verdict = "Міцний гармонійний тандем. Спільна робота над стосунками принесе прекрасний довговічний шлюб чи дружбу.";
  } else if (score < 40) {
    verdict = "Складні кармічні випробування. Зв'язок має високий рівень тертя, проте це чудовий стимул для внутрішнього духовного росту обох.";
  }

  return { score, verdict, points };
}
