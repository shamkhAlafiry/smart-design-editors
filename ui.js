document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('generateAIBtn').addEventListener('click', async () => {
    const prompt = document.getElementById('aiPrompt').value.trim(); if (!prompt) return alert('اكتب وصفاً');
    document.getElementById('generateAIBtn').disabled = true; document.getElementById('aiLoader').style.display = 'block';
    try { const design = await generateDesignFromPrompt(prompt, 'poster'); applyDesignToCanvas(design); } catch (e) { alert('فشل: ' + e.message); }
    document.getElementById('generateAIBtn').disabled = false; document.getElementById('aiLoader').style.display = 'none';
  });
  document.getElementById('generateLogoBtn').addEventListener('click', async () => {
    const prompt = document.getElementById('logoPrompt').value.trim(); if (!prompt) return alert('اكتب اسم الشركة');
    try { const design = await generateDesignFromPrompt(prompt, 'logo'); applyDesignToCanvas(design); } catch (e) { alert('فشل: ' + e.message); }
  });
  document.getElementById('addTextBtn').addEventListener('click', () => addText('نص جديد', { fontFamily: 'Cairo', fill: '#ffffff' }));
  document.getElementById('addImageBtn').addEventListener('click', () => document.getElementById('imageUpload').click());
  document.getElementById('imageUpload').addEventListener('change', (e) => { if (e.target.files[0]) addImageFromFile(e.target.files[0]); });
  document.getElementById('bgColorPicker').addEventListener('input', (e) => setBackgroundColor(e.target.value));
  document.getElementById('randomPaletteBtn').addEventListener('click', () => {
    const hue = Math.floor(Math.random() * 360); setBackgroundColor(`hsl(${hue}, 70%, 15%)`);
    canvas.getObjects().forEach(obj => { if (obj.type === 'i-text') obj.set({ fill: `hsl(${(hue + 120) % 360}, 80%, 70%)` }); });
    canvas.forceRender(); saveState();
  });
  document.getElementById('alignLeft').addEventListener('click', alignLeft);
  document.getElementById('alignCenterH').addEventListener('click', alignCenterH);
  document.getElementById('alignRight').addEventListener('click', alignRight);
  document.getElementById('alignTop').addEventListener('click', alignTop);
  document.getElementById('alignMiddleV').addEventListener('click', alignMiddleV);
  document.getElementById('alignBottom').addEventListener('click', alignBottom);
  const settingsPanel = document.getElementById('selectedSettings');
  canvas.on('selection:created', updateSettings); canvas.on('selection:updated', updateSettings); canvas.on('selection:cleared', () => { settingsPanel.style.display = 'none'; });
  function updateSettings() {
    const obj = getActive(); if (!obj || obj.type !== 'i-text') { settingsPanel.style.display = 'none'; return; }
    settingsPanel.style.display = 'block'; document.getElementById('textColorPicker').value = obj.fill || '#fff';
    document.getElementById('fontFamilySelect').value = obj.fontFamily || 'Cairo'; document.getElementById('opacitySlider').value = obj.opacity || 1;
    document.getElementById('strokeWidth').value = obj.strokeWidth || 0; document.getElementById('strokeColor').value = obj.stroke || '#000';
    document.getElementById('rotationSlider').value = obj.angle || 0;
  }
  document.getElementById('textColorPicker').addEventListener('input', (e) => { const obj = getActive(); if (obj) { obj.set('fill', e.target.value); canvas.forceRender(); saveState(); } });
  document.getElementById('fontFamilySelect').addEventListener('change', (e) => { const obj = getActive(); if (obj) { obj.set('fontFamily', e.target.value); canvas.forceRender(); saveState(); } });
  document.getElementById('opacitySlider').addEventListener('input', (e) => applyEffect('opacity', e.target.value));
  document.getElementById('toggleShadow').addEventListener('click', () => { const obj = getActive(); if (obj) { const has = !!obj.shadow; applyEffect('shadow', !has); document.getElementById('toggleShadow').textContent = has ? 'تفعيل' : 'إلغاء'; } });
  document.getElementById('strokeWidth').addEventListener('input', (e) => applyEffect('stroke', e.target.value));
  document.getElementById('strokeColor').addEventListener('input', (e) => { const obj = getActive(); if (obj) { obj.set('stroke', e.target.value); canvas.forceRender(); saveState(); } });
  document.getElementById('rotationSlider').addEventListener('input', (e) => applyEffect('rotation', e.target.value));
  document.getElementById('deleteSelectedBtn').addEventListener('click', () => { const obj = getActive(); if (obj) { canvas.remove(obj); settingsPanel.style.display = 'none'; canvas.forceRender(); saveState(); updateLayersList(); } });
  document.getElementById('bringForward').addEventListener('click', bringForward);
  document.getElementById('sendBackward').addEventListener('click', sendBackward);
  document.getElementById('undoBtn').addEventListener('click', undo);
  document.getElementById('redoBtn').addEventListener('click', redo);
  document.getElementById('exportBtn').addEventListener('click', exportPNG);
  document.querySelectorAll('.preset-btn[data-width]').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.preset-btn[data-width]').forEach(b => b.classList.remove('active')); btn.classList.add('active'); setCanvasSize(parseInt(btn.dataset.width), parseInt(btn.dataset.height)); }); });
  document.getElementById('penToolBtn').addEventListener('click', enablePenTool);
  document.getElementById('removeBgBtn').addEventListener('click', () => { const obj = getActive(); if (!obj || obj.type !== 'image') return alert('حدد صورة أولاً'); alert('خاصية إزالة الخلفية تحتاج إلى API'); });
  document.getElementById('faceEditBtn').addEventListener('click', () => { const obj = getActive(); if (!obj || obj.type !== 'image') return alert('حدد صورة أولاً'); alert('خاصية تعديل الوجه تحتاج إلى API'); });
  document.getElementById('enhanceBtn').addEventListener('click', () => { const obj = getActive(); if (!obj || obj.type !== 'image') return alert('حدد صورة أولاً'); alert('خاصية تحسين الصورة تحتاج إلى API'); });
  document.getElementById('ttsBtn').addEventListener('click', () => { const obj = getActive(); if (obj && obj.type === 'i-text') { const u = new SpeechSynthesisUtterance(obj.text); u.lang = 'ar-SA'; speechSynthesis.speak(u); } else { alert('حدد نصاً أولاً'); } });
  fetch('templates.json').then(r => r.json()).then(templates => { const grid = document.getElementById('templateGrid'); if (!grid) return; grid.innerHTML = ''; templates.forEach(tmpl => { const div = document.createElement('div'); div.className = 'template-item'; div.innerHTML = `<i class="fas ${tmpl.icon}"></i><br>${tmpl.name}`; div.addEventListener('click', () => applyDesignToCanvas(tmpl.design)); grid.appendChild(div); }); }).catch(() => console.log('templates.json غير موجود'));
  if (canvas.getObjects().length === 0) { addText('مرحباً! جرب الأدوات 😊', { fill: '#aaa', fontSize: 30 }); }
});