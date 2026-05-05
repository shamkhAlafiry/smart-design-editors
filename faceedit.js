function showFaceEditPanel() {
  const activeImg = canvas.getActiveObject();
  if (!activeImg || activeImg.type !== 'image') {
    alert('الرجاء تحديد صورة تحتوي على وجه');
    return;
  }
  showContextPanel('تعديل الوجه (AI)', `
        <label>العينان <input type="range" id="eyesRange" min="-15" max="15" value="0"></label>
        <label>الأنف <input type="range" id="noseRange" min="-15" max="15" value="0"></label>
        <label>الفم <input type="range" id="mouthRange" min="-15" max="15" value="0"></label>
        <button id="applyFaceBtn">تطبيق التعديلات</button>
    `);
  document.getElementById('applyFaceBtn').addEventListener('click', async () => {
    const eyes = +document.getElementById('eyesRange').value;
    const nose = +document.getElementById('noseRange').value;
    const mouth = +document.getElementById('mouthRange').value;
    try {
      const result = await editFaceAPI(activeImg.toDataURL(), { eyes, nose, mouth });
      // تحديث الصورة بالنتيجة
      fabric.Image.fromURL('data:image/png;base64,' + result.image, (img) => {
        img.set(activeImg.get());
        canvas.remove(activeImg);
        canvas.add(img);
        canvas.forceRender();
        saveState();
        alert('✅ تم تعديل الوجه بنجاح');
      });
    } catch (e) { alert('فشل: ' + e.message); }
  });
}