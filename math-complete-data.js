// 25 套期中真题逐题清单：C 为选择题，F 为原填空大题，S 为解答题转填空，P 为保留纸上作答的证明题。
const MATH_COMPLETE=[];
function mc(course,year,n,page,answerPage,prompt,options,key,explanation,note=''){
 MATH_COMPLETE.push({id:'mc-'+course+'-'+year+'-C'+n,course,year,number:'C'+n,kind:'choice',page,answerPage,prompt,options:options.split('|'),answers:[...key].map(c=>c.charCodeAt(0)-65),explanation,note});
}
function mbl(label,answer,wrong,aliases=[],extra={}){return {label,answer,options:[answer,...wrong.split('|')],aliases,...extra};}
function mnum(label,answer,wrong,tolerance=0.005){return mbl(label,String(answer),wrong,[],{numeric:true,tolerance});}
function mfill(course,year,n,page,answerPage,prompt,blanks,explanation,note=''){
 MATH_COMPLETE.push({id:'mc-'+course+'-'+year+'-F'+n,course,year,number:'F'+n,kind:'fill',page,answerPage,prompt,blanks,explanation,note});
}
function msolv(course,year,n,page,answerPage,prompt,blanks,explanation,note=''){
 MATH_COMPLETE.push({id:'mc-'+course+'-'+year+'-S'+n,course,year,number:'S'+n,kind:'solve',page,answerPage,prompt,blanks,explanation,note});
}
function mp(course,year,n,page,answerPage,prompt,explanation,note=''){
 MATH_COMPLETE.push({id:'mc-'+course+'-'+year+'-P'+n,course,year,number:'P'+n,kind:'proof',page,answerPage,prompt,explanation,note});
}
