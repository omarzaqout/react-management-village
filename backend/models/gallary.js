const mongoose = require("mongoose");

// تعريف المخطط
const imageSchema = new mongoose.Schema(
  {
    src: { type: String, required: true },       // لتخزين رابط الصورة أو البيانات بصيغة Base64
    description: { type: String, required: true }, // الوصف
    name: { type: String, required: true },        // اسم الصورة
  },
  { timestamps: true } // إضافة الطوابع الزمنية (تاريخ الإنشاء والتعديل)
);

// إنشاء النموذج بناءً على المخطط
const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
