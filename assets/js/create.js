(function(){
  'use strict';
  var templates=[{id:'birthday-letter',title:'生日来信',text:'在生日当天，送一份会打开的惊喜。'},{id:'mom-letter',title:'写给妈妈',text:'把平时没说出口的感谢，好好写下来。'},{id:'teacher-thanks',title:'写给老师',text:'留住一份认真、温暖的感谢。'}];
  var selected=new URLSearchParams(location.search).get('template')||'birthday-letter',picker=document.getElementById('templatePicker');
  templates.forEach(function(t){var label=document.createElement('label');label.className='template-option';label.innerHTML='<input type="radio" name="templateId" value="'+t.id+'"><strong>'+t.title+'</strong><span>'+t.text+'</span>';label.querySelector('input').checked=t.id===selected;picker.appendChild(label);});
  var form=document.getElementById('createForm'),button=document.getElementById('submitButton'),error=document.getElementById('formError');
  form.addEventListener('submit',async function(event){event.preventDefault();error.textContent='';if(!form.reportValidity())return;var data=new FormData(form),photo=data.get('photo');if(photo&&photo.size>5*1024*1024){error.textContent='照片不能超过 5MB。';return;}button.disabled=true;button.textContent='正在生成…';try{var response=await fetch(window.SUPABASE_CONFIG.url+'/functions/v1/create-card',{method:'POST',headers:{apikey:window.SUPABASE_CONFIG.publishableKey},body:data});var result=await response.json();if(!response.ok)throw new Error(result.error||'创建失败，请稍后重试。');location.href='card.html?id='+encodeURIComponent(result.id)+'&new=1';}catch(err){error.textContent=err.message||'网络异常，请稍后重试。';button.disabled=false;button.innerHTML='生成专属链接 <span>↗</span>';}});
}());
