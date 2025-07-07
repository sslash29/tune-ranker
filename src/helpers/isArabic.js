const isArabic = (text) => /[\u0600-\u06FF]/.test(text);

export default isArabic;
