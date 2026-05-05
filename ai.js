async function generateDesignFromPrompt(prompt, type = 'poster') {
  try {
    const res = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt, type }) });
    if (res.ok) return await res.json();
    throw new Error('استخدام المحاكاة');
  } catch (e) {
    console.log('محاكاة التصميم...');
    if (type === 'logo') {
      return { title: prompt, subtitle: 'شعار احترافي', bgColor: '#2d2d44', titleColor: '#ff6b6b', subtitleColor: '#feca57', fontTitle: 'Cairo', fontSubtitle: 'Tajawal', elements: [{ type: 'text', content: prompt, x: 0.5, y: 0.4, fontSize: 48, fontWeight: 'bold' }, { type: 'text', content: 'شعارك المميز', x: 0.5, y: 0.6, fontSize: 28 }] };
    } else {
      return { title: 'تصميم مذهل', subtitle: prompt, bgColor: '#1e2a3a', titleColor: '#4dc9f6', subtitleColor: '#ffffff', fontTitle: 'Cairo', fontSubtitle: 'Tajawal', elements: [{ type: 'text', content: prompt, x: 0.5, y: 0.5, fontSize: 36 }] };
    }
  }
}

function applyDesignToCanvas(design) {
  clearCanvas();
  setBackgroundColor(design.bgColor || '#1e1e2f');
  design.elements.forEach((el, i) => {
    if (el.type === 'text') {
      const txt = new fabric.IText(el.content, { left: el.x * canvas.width, top: el.y * canvas.height, fontFamily: el.fontFamily || design.fontTitle || 'Cairo', fill: el.color || design.titleColor || '#fff', fontSize: el.fontSize || 36, fontWeight: el.fontWeight || 'normal', originX: 'center', originY: 'center', editable: false });
      canvas.add(txt); txt.set({ opacity: 0 }); txt.animate('opacity', 1, { duration: 300, delay: i * 80, onChange: () => canvas.forceRender() });
    }
  });
  if (design.title && !design.elements.some(e => e.content === design.title)) { const title = new fabric.IText(design.title, { left: canvas.width / 2, top: canvas.height * 0.2, fontFamily: design.fontTitle || 'Cairo', fill: design.titleColor || '#ff6b6b', fontSize: 55, fontWeight: 'bold', originX: 'center', originY: 'center', editable: false }); canvas.add(title); title.set({ opacity: 0 }); title.animate('opacity', 1, { duration: 300, onChange: () => canvas.forceRender() }); }
  if (design.subtitle) { const sub = new fabric.IText(design.subtitle, { left: canvas.width / 2, top: canvas.height * 0.35, fontFamily: design.fontSubtitle || 'Tajawal', fill: design.subtitleColor || '#feca57', fontSize: 32, originX: 'center', originY: 'center', editable: false }); canvas.add(sub); sub.set({ opacity: 0 }); sub.animate('opacity', 1, { duration: 300, delay: 100, onChange: () => canvas.forceRender() }); }
  canvas.forceRender(); saveState(); updateLayersList();
}