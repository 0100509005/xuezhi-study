// 五套原卷逐题清单；C 为原选择题号，F 为原填空大题号。
const CHEM_COMPLETE=[];
function allChemCompleteQuestions(){return typeof CHEM_UNIT_QUESTIONS==='undefined'?CHEM_COMPLETE:[...CHEM_COMPLETE,...CHEM_UNIT_QUESTIONS];}
function cc(paper,n,page,answerPage,prompt,options,key,explanation,note=''){
 CHEM_COMPLETE.push({id:paper+'-C'+n,paper,number:'C'+n,page,answerPage,prompt,options:options.split('|'),answers:[...key].map(c=>c.charCodeAt(0)-65),explanation,note});
}
function cb(label,answer,wrong,aliases=[],extra={}){return {label,answer,options:[answer,...wrong.split('|')],aliases,...extra};}
function cf(paper,n,page,answerPage,prompt,blanks,explanation,note=''){
 CHEM_COMPLETE.push({id:paper+'-F'+n,paper,number:'F'+n,page,answerPage,prompt,blanks,explanation,note});
}
cc('mid2020',1,2,7,'下列属于封闭体系的是：','试管内 CO 还原 CuO|烧杯内锌与盐酸反应|密闭容器内金属腐蚀|敞口保温瓶内硫升华','C','封闭体系可以交换能量，但不与环境交换物质。');
cc('mid2020',2,2,8,'下列说法正确的是（C 按结构相近分子的常见比较理解）：','非极性分子中只有非极性共价键|极性分子中的化学键都有极性|相对分子质量越大，色散力通常越大|色散力只存在于极性分子之间','C','色散力来自瞬时偶极，普遍存在；结构相近时，较大的电子云通常更容易变形。分子极性要看各键偶极的矢量和。','为 C 补充比较范围，避免把相对分子质量当成唯一判据。');
cc('mid2020',3,2,8,'298 K 时，下列固体中标准摩尔熵最大的是：','MgF₂|MgO|Mg|MgSO₄','D','在本组选项中 MgSO₄ 的标准摩尔熵最大；原子数和结构可帮助定性比较，但精确大小应查标准熵表。');
cc('mid2020',4,2,8,'298 K 时，下列物质中标准摩尔生成焓不等于零的是：','Fe(s)|C(石墨)|Ne(g)|Cl₂(l)','D','零值规定针对指定温度下的参考态单质；氯的参考态为 Cl₂(g)，不是液态。','原题写“等于零”却给 D，且 A、B、C 均为零；按原单选意图订正为“不等于零”。');
cc('mid2020',5,3,8,'按通常的标准反应焓、熵符号判断，常温或升高温度均不利于正向自发的反应是：','Ag₂O(s) → 2Ag(s) + ½O₂(g)|Fe₂O₃(s) + ³⁄₂C(s) → 2Fe(s) + ³⁄₂CO₂(g)|N₂O₄(g) → 2NO₂(g)|6C(s) + 6H₂O(g) → C₆H₁₂O₆(s)','D','D 为吸热且熵减，ΔG°=ΔH°−TΔS° 为正；其他选项生成气体或增加气体量，高温可能有利。此处使用焓熵符号不变的近似。');
cc('mid2020',6,3,8,'恒温恒压、只做体积功时，实际反应的 ΔᵣGₘ=0，表示：','正向一定自发|正向一定非自发|不确定|处于平衡状态','D','实际组成下的反应吉布斯能为零是反应平衡条件；不要与 ΔᵣG°=0 混淆。');
cc('mid2020',7,3,8,'分别在 1000 g 水中加入 1 g 葡萄糖、NaCl、CaCl₂、Na₂SO₄。摩尔质量依次为 180、58.5、111、144 g/mol，理想稀溶液凝固点最低的是：','葡萄糖|NaCl|CaCl₂|Na₂SO₄','B','ΔT_f=iK_f b。同样溶质质量、溶剂质量，比较 i/M：1/180、2/58.5、3/111、3/144，NaCl 最大。','按盐完全解离且忽略离子相互作用的近似。');
cc('mid2020',8,3,8,'同温度下 0.1 mol/L 的①葡萄糖、②KCl、③Na₂CO₃ 理想稀水溶液，渗透压顺序是：','①=②=③|①>②>③|①<②<③|无法确定','C','π=icRT；完全解离近似下 i 分别为 1、2、3。');
cc('mid2020',9,3,9,'下列说法正确的是：','W、Q 是状态函数|H、U、G 是具有广度性质的状态函数|S、p、T 均为强度量|ρ、T、H 均为广度量','B','H、U、G 随系统物质的量成比例增加。S 是广度量，p、T、ρ 是强度量；热和功取决于路径。');
cc('mid2020',10,3,9,'下列液体沸腾时，只需克服分子间色散力的是：','O₂|SO₂|HF|H₂O','A','O₂ 为非极性分子；SO₂ 有永久偶极，HF 和水还存在氢键。沸腾不需要打断分子内部共价键。');
cc('mid2020',11,3,9,'某基态原子最外层只有一个 l=0 的电子，该元素不可能属于：','s 区|ds 区|d 区|p 区','D','l=0 对应 s 亚层。题设为最外层 ns¹；p 区基态最外层一般为 ns²np¹～⁶（He 另论）。');
cc('mid2020',12,3,9,'按鲍林近似能级顺序，以下 (n,l,mₗ,mₛ) 对应能量最高的是：','(3,1,0,+½)|(2,1,1,−½)|(3,2,−1,−½)|(4,0,0,+½)','C','依次为 3p、2p、3d、4s；按题设近似，2p<3p<4s<3d。');
cc('mid2020',13,4,9,'氢原子的 1s 电子分别激发到 4s 和 4p 所需能量：','前者大|后者大|相等|无法判断','C','忽略精细结构等效应，氢原子能量只由 n 决定；4s 与 4p 的 n 都是 4。');
cc('mid2020',14,4,9,'下列离子半径最小的是：','Al³⁺|Mg²⁺|S²⁻|Cl⁻','A','Al³⁺、Mg²⁺ 都有 10 个电子，核电荷更大的 Al³⁺ 更小；后两者有三层电子。');
cc('mid2020',15,4,9,'下列离子的变形性最大的是：','Al³⁺|Mg²⁺|S²⁻|Cl⁻','C','变形性是电子云被外电场扭曲的难易程度。半径大、负电荷较多的 S²⁻ 较易变形。');
cc('mid2018',1,13,19,'用 VSEPR 模型形式上分析 SCl₆，预期空间构型为：','正八面体|三角锥|平面三角形|正四面体','A','六个成键电子域、零孤对电子域，AX₆ 对应八面体。这是模型构型题，不代表该分子在常温下稳定存在。');
cc('mid2018',2,13,19,'下列叙述正确的有（按独立分子构型判断）：','BF₃、CS₂、NH₃、PCl₃ 均极性|PCl₅、BeCl₂、H₂S、NF₃ 均极性|BF₃、CS₂ 非极性，H₂S、NF₃ 极性|SO₃、BCl₃ 非极性，SO₂、SnCl₂ 极性','CD','对称结构可能使键偶极抵消；BF₃、SO₃、BCl₃ 平面三角形，CS₂ 直线形；弯曲形或三角锥形常有净偶极。');
cc('mid2018',3,13,20,'SO₃ 与 SO₂ 分子之间存在哪些作用力？','色散力和诱导力|取向力和诱导力|取向力和色散力|取向力、色散力和诱导力','A','SO₃ 非极性，SO₂ 极性；永久偶极可诱导另一分子的电子云变形，另有普遍存在的色散力。');
cc('mid2018',4,13,20,'下列叙述正确的有：','离子化合物可能含共价键|分子内部共价键越强，分子晶体熔点必越高|金属键没有饱和性和方向性|非极性分子可能含极性键','ACD','例如 NH₄Cl 含共价键；分子晶体熔化主要克服分子间作用；CO₂ 中极性键的偶极可相互抵消。');
cc('mid2018',5,13,20,'下列哪组量与过程途径有关？','Q、W|U、ΔU|H、ΔH|S、ΔS','A','热 Q 和功 W 是过程量；状态函数及其两态差由始末态确定。');
cc('mid2018',6,14,20,'298 K 时，标准摩尔生成焓不等于零的是：','Cl₂(g)|O₂(g)|O₃(g)|Ne(g)','C','氧元素参考态是 O₂(g)，臭氧不是参考态单质。');
cc('mid2018',7,14,20,'ΔᵣH°>0、ΔᵣS°>0，忽略二者随温度变化，标准态反应：','低温自发、高温不自发|高温自发、低温不自发|任何温度不自发|任何温度自发','B','ΔᵣG°=ΔᵣH°−TΔᵣS°，T>ΔᵣH°/ΔᵣS° 时为负。');
cc('mid2018',8,14,20,'NCl₃ 呈三角锥形，中心 N 原子采用：','sp|dsp²|sp²|不等性 sp³','D','N 有三个成键域和一对孤对电子，共四个电子域；分子构型只看原子位置，为三角锥。');
cc('mid2018',9,14,20,'下列哪些现象可能涉及渗透或反渗透？','血液透析过程中的跨膜水分转移|施肥过量使植物萎蔫|用反渗透法淡化海水|道路撒盐降低结冰温度','ABC','透析中小溶质主要靠扩散；其中水分转移可涉及渗透。施肥过量使细胞失水；反渗透靠外压逆转水的净迁移；撒盐融冰主要是凝固点降低。','明确 A 的跨膜水分转移和 C 的反渗透工艺，避免把透析本身等同渗透或所有淡化工艺都说成反渗透。');
cc('mid2018',10,14,20,'298 K 标准摩尔燃烧焓定义中，规定的完全燃烧终态包括：','C → CO₂(g)|H → H₂O(l)|H → H₂O(g)|N → N₂(g)','ABD','定义采用指定燃烧产物及状态；298 K 时水取液态，氮取 N₂。');
cc('mid2018',11,14,20,'给定一组允许的 n、l、mₗ，不能确定的是：','该轨道实际占有的电子数|轨道形状类型|指定原子模型中的轨道能量|确定的空间轨道数','A','三量子数标记一个空间轨道，但它可以空置、单占或双占；不能由轨道标签得出电子占有数。');
cc('mid2015',1,24,31,'SF₄ 分子的空间构型是：','变形四面体（跷跷板形）|三角锥|平面三角形|正四面体','A','中心 S 有五个电子域，其中一对孤对电子，AX₄E 为跷跷板形。');
cc('mid2015',2,24,31,'按基础分子轨道模型，以下哪项键级为零？','B₂|He₂⁺|Be₂|O₂²⁺','C','键级=(成键电子数−反键电子数)/2。依次为 1、0.5、0、3。','原题用“不可能存在”过于绝对；订正为基础模型的“键级为零”，不否认高精度理论中的弱结合。');
cc('mid2015',3,24,32,'多电子原子中，下列量子数对应能量最低的是：','(3,1,0,+½)|(3,1,1,−½)|(3,0,0,+½)|(3,2,1,−½)','C','对应 3p、3p、3s、3d；常用能级顺序 3s<3p<3d。');
cc('mid2015',4,24,32,'下列叙述正确的有（按独立分子构型判断）：','CCl₄、CO₂ 非极性；NH₃、PCl₃ 极性|PCl₅、BeCl₂ 非极性；H₂S、NH₃ 极性|CO₂、CCl₄ 非极性；PCl₃、BeCl₂ 极性|CO₂、BCl₃ 非极性；BF₃、BeCl₂ 极性','AB','CCl₄、CO₂、PCl₅、BeCl₂ 对称，净偶极为零；NH₃、PCl₃、H₂S 的键偶极不完全抵消。');
cc('mid2015',5,25,32,'NH₃ 与 CCl₄ 分子之间存在哪些作用力？','取向力和诱导力|色散力和诱导力|取向力和色散力|取向力、色散力和诱导力','B','NH₃ 极性、CCl₄ 非极性；有诱导力、色散力，不具备两个永久偶极形成取向力的条件。');
cc('mid2015',6,25,32,'同温同容混合气体中，H₂、O₂、N₂、CO₂ 质量相同，分压最小的是：','H₂|O₂|N₂|CO₂','D','pᵢ=nᵢRT/V，nᵢ=mᵢ/Mᵢ。同质量时摩尔质量最大的 CO₂ 物质的量最少。');
cc('mid2015',7,25,32,'同一压力下，按完全解离的理想稀水溶液近似，沸点最高的是：','0.1 mol/L MgCl₂|0.1 mol/L NaCl|0.1 mol/L AlCl₃|0.1 mol/L 蔗糖','C','在稀溶液浓度可近似比较时，粒子数因子依次为 3、2、4、1，AlCl₃ 的沸点升高最大。');
cc('mid2015',8,25,32,'下列叙述正确的有：','离子化合物可能含有共价键|构成晶体的粒子一定含共价键|共价键可能具有部分离子性|非极性分子一定含非极性键','AC','NH₄Cl 中有共价键；稀有气体晶体是反例；极性共价键可有部分离子性；CO₂ 不含非极性键却是非极性分子。','B 的“分子”改为“粒子”，消除离子晶体和金属晶体并非由分子构成的用词问题。');
cc('mid2015',9,25,32,'H₂ 与 Cl₂ 在密闭、绝热、刚性容器中发生不可逆反应；无其他功，忽略宏观动能和势能变化。能确定的是：','ΔU=0，ΔS>0|ΔU<0，ΔS>0|ΔU=0，ΔS=0|ΔU>0，ΔS<0','A','绝热 Q=0、刚性容器体积功为零，所以 ΔU=Q+W=0。隔离体系的不可逆过程 ΔS>0。实际温度会升高，不能套用恒温恒压 ΔG 判据。','原选项同时断言 ΔH=0、ΔG<0，条件不足；保留原热力学考点，重写可严格判定的选项。');
cc('mid2015',10,25,32,'C(s)+H₂O(g) → CO(g)+H₂(g)，ΔᵣH°=131.3 kJ/mol。按焓熵近似不变，反应：','高温有利于正向自发，低温不利|低温有利，高温不利|任何温度自发|任何温度不自发','A','吸热且气体物质的量增加，通常 ΔS°>0；高温使 −TΔS° 项更有利。原解析的“熵减”是笔误。');
cc('mid2015',11,25,32,'下列属于状态函数的一组是：','Q、W、U|Q、W、ΔU|ΔU、ΔH、ΔS|G、H、S','D','G、H、S 是状态函数本身；ΔU 等是两状态之间的变化量，Q、W 则是过程量。');
cc('mid2023',1,1,4,'l=2 时，磁量子数不可能为：','2|0|−3|−1','C','mₗ 只能取 −2、−1、0、1、2。');
cc('mid2023',2,1,4,'按多电子原子常用近似能级顺序，正确的是：','3s<3p<3d<4s|3d<4s<4p<5s|5s<4d<5p<4f|4s<4p<3d<5s','C','按近似排布顺序 4s<3d<4p<5s<4d<5p<6s<4f；选项 C 的相对顺序成立。');
cc('mid2023',3,1,4,'下列基态电子构型不正确的是：','C：[He]2s²2p²|C：1s²2s²2p²|Cu：[Ar]3d⁹4s²|Ne：1s²2s²2p⁶','C','Cu 基态为 [Ar]3d¹⁰4s¹。');
cc('mid2023',4,1,4,'以气态原子获得电子时放出的能量为正，以下电子亲合能最大的是：','O|F|He|Li','B','本组选项中 F 得电子放能最多。不要误记为整个周期表最大：Cl 的第一电子亲合能高于 F。');
cc('mid2023',5,1,4,'正己烷 C₆H₁₄ 中碳原子的杂化方式为：','sp|sp²|sp³|sp³d²','C','每个碳有四个 σ 键、四个成键方向，采用 sp³ 描述。');
cc('mid2023',6,1,5,'下列化合物中离子间结合最强的是：','NaCl|KF|MgO|CaCl₂','C','Mg²⁺ 与 O²⁻ 电荷乘积大且离子间距离较短，晶格能很大。');
cc('mid2023',7,2,5,'按本课程常见同系列比较，离子极化增强的典型影响是：','熔点升高|颜色变深|稳定性升高|沸点升高','B','极化使电子云变形、共价性增强；本题选颜色变深。具体物质的颜色、熔沸点还受结构等因素影响，不能视为普遍定律。');
cc('mid2023',8,2,5,'杂化轨道与空间构型的错误组合是：','sp—直线形|sp³—四面体|dsp²—三角双锥|sp³d²—八面体','C','dsp² 对应平面四方，三角双锥通常用 sp³d 描述。');
cc('mid2023',9,2,5,'按单个典型氢键强度比较，最强的是：','NH₃|H₂O|HF|H₂S','C','F 电负性很大、半径小，H—F···F 氢键较强。不能据此断言 HF 的沸点比水高；水能形成更广泛的氢键网络。','明确比较单个氢键，避免与整体分子间结合及沸点混淆。');
cc('mid2023',10,2,5,'与稀溶液依数性无关的是：','蒸气压下降|沸点升高|凝固点降低|溶解放热','D','依数性主要取决于有效溶质粒子浓度；溶解热取决于具体相互作用。');
cc('mid2023',11,2,5,'以下哪项不宜作为一般晶体的共同特征？','固定熔点|所有物理性质均各向同性|结构周期性|规则外形','B','晶体常呈各向异性，但立方晶体的某些性质可以各向同性；不能反过来仅凭各向同性断言不是晶体。','将原“各向同性”明确为“所有物理性质均各向同性”，保留原题意并说明例外。');
cc('mid2023',12,2,5,'均为状态函数且具有加和性的一组是：','S、H、T|S、U、G|U、H、Qₚ|W、S、G','B','S、U、G 是广度量；T 是强度量；热 Q 和功 W 是过程量。');
cc('mid2023',13,2,5,'理想气体在绝热容器内向真空自由膨胀，错误的是：','Q=0|W=0|ΔH=0|ΔS=0','D','绝热 Q=0，外压为零故 W=0，ΔU=0。理想气体温度不变，ΔH=0；体积增大使 ΔS=nR ln(V₂/V₁)>0。','补充绝热条件，否则题干不足以保证 Q=0。');
cc('mid2023',14,2,5,'恒压下 2KClO₃(s) → 2KCl(s)+3O₂(g)，每 1 mol KClO₃ 分解放热 44.8 kJ；按此方程式的 ΔᵣH°ₘ 为：','−89.6 kJ/mol|+89.6 kJ/mol|−44.8 kJ/mol|+44.8 kJ/mol','A','反应进度为 1 mol 时消耗 2 mol KClO₃；放热取负，故 −2×44.8。');
cc('mid2023',15,2,5,'FeO(s)+C(s) → CO(g)+Fe(s)，ΔᵣH°ₘ>0，按常见焓熵近似判断：','ΔᵣG°ₘ 总大于零|高温可能自发|任何温度自发|低温更利于自发','B','由固体生成气体使熵增加，高温使 −TΔS 项更负。');
cc('mid2024',1,1,4,'同型晶体中，晶格能最高的是：','NaCl|NaBr|NaI|NaF','D','相同离子电荷下，F⁻ 半径最小，离子间静电作用较强。');
cc('mid2024',2,1,4,'A、B 电负性差为 0.6，按课程经验分类，主要键型是：','离子键|极性共价键|氢键|非极性共价键','B','电子对偏向电负性较大的原子，形成极性共价键。电负性差阈值只是经验判据。');
cc('mid2024',3,1,5,'同核双原子分子的两套 p 轨道可组成多少个 π 型分子轨道（含反键轨道）？','2|4|3|6','B','垂直键轴的两组 p 轨道各形成一个 π 成键和一个 π* 反键轨道，共四个。');
cc('mid2024',4,1,5,'撒融雪剂主要利用：','沸点升高|蒸气压下降|凝固点降低|渗透压降低','C','溶质使水的凝固点降低，在适当温度范围促使冰融化。');
cc('mid2024',5,1,5,'下列物质沸点最低的是：','HI|HBr|HCl|HF','C','HF 有较强氢键；HCl、HBr、HI 中，分子越大色散力通常越强，因此 HCl 最低。');
cc('mid2024',6,1,5,'同时具有 n=2、mₗ=−1 的空间轨道数为：','0|1|2|3','B','n=2 允许 l=0、1；mₗ=−1 只能属于 l=1，唯一确定一个 2p 轨道。');
cc('mid2024',7,2,5,'按定向轨道重叠的通常价键理论描述，下列说法正确的是：','离子键有饱和性和方向性|共价键通常有饱和性和方向性|色散力有饱和性和方向性|诱导力与分子变形性无关','B','共用电子对和轨道重叠带来常见的饱和性、方向性；s—s 成键的方向讨论有例外，不能把“通常”说成无条件“都”。');
cc('mid2024',8,2,5,'第一电离能关系正确的是：','Na>Ar|Al>Si|Mg>Al|Mg>P','C','Mg 的 3s² 较稳定；Al 失去的是较易移除的 3p¹ 电子，因此 Mg 的第一电离能更高。');
cc('mid2024',9,2,5,'2 g H₂ 与 2 g He 混合，总压 3300 kPa。He 分压为：','3300 kPa|2200 kPa|1100 kPa|1650 kPa','C','H₂ 为 1 mol，He 为 0.5 mol。p(He)=0.5/1.5×3300=1100 kPa。');
cc('mid2024',10,2,5,'按多电子原子的常见近似，以下量子数组对应能量最高的是：','(4,2,+1,+½)|(3,1,+1,−½)|(4,1,0,−½)|(3,1,0,−½)','A','对应 4d、3p、4p、3p；其中 4d 最高。');
cc('mid2024',11,2,5,'以下分子的常用分子轨道能级图中，π₂p 高于 σ₂p 的是：','Li₂|C₂|N₂|F₂','D','F₂ 常用顺序为 σ₂p<π₂p；B₂、C₂、N₂ 的常用顺序相反，与 s—p 混合有关。','原题把 σ₂p 误写为 σ₂s；按原参考答案 D 对应的考点订正，原印刷题不能按 D 唯一判分。');
cc('mid2024',12,2,5,'恒温恒压且不做非体积功，正向自发判据是：','ΔH°<0|ΔS°<0|ΔG<0|ΔfH°ₘ<0','C','用实际状态下的 ΔG，不是任意条件下都用标准量。');
cc('mid2024',13,2,5,'298 K，C(s)+CO₂(g) → 2CO(g)。理想气体近似下 ΔᵣU°ₘ 等于：','ΔᵣH°ₘ|ΔᵣH°ₘ+2.48 kJ/mol|ΔᵣH°ₘ−2.48 kJ/mol|−ΔᵣH°ₘ','C','ΔH=ΔU+Δn_gRT；气体系数差为 2−1=1，RT≈2.48 kJ/mol。');
cc('mid2024',14,2,5,'NH₄NO₃ 在未饱和水溶液中自发溶解并使溶液变冷。按恒温恒压过程分析，ΔG、ΔH、ΔS 的符号依次为：','−、+、+|+、+、−|−、+、−|+、−、+','A','自发对应 ΔG<0，吸热对应 ΔH>0；由 ΔS=(ΔH−ΔG)/T 得 ΔS>0。');
cc('mid2024',15,2,5,'放热且熵减的反应，忽略 ΔH、ΔS 随温度变化，则：','任何温度均自发|足够低温可以自发|足够高温可以自发|任何温度均不自发','B','ΔH<0、ΔS<0，降低 T 可减小正的 −TΔS 项。');
const FE_CONFIG='[Ar]3d⁶4s²',O2PLUS='(σ1s)²(σ*1s)²(σ2s)²(σ*2s)²(σ2pz)²(π2px)²(π2py)²(π*2px)¹';
function numBlank(label,answer,wrong,tolerance=.01){return cb(label,String(answer),wrong,[],{numeric:true,tolerance});}
function period4(){return cb('周期','4','3|5|6',['四','第四','第四周期']);}
function feBlank(label='基态电子排布'){return cb(label,FE_CONFIG,'[Ar]3d⁸|[Ar]3d⁴4s²|[Ar]3d⁶',['1s²2s²2p⁶3s²3p⁶3d⁶4s²','[Ar]4s²3d⁶']);}
function moBlank(){return cb('O₂⁺ 分子轨道电子排布（以 z 为键轴；可用 [KK] 代替内层）',O2PLUS,'(σ1s)²(σ*1s)²(σ2s)²(σ*2s)²(σ2pz)²(π2px)²(π2py)²|'+O2PLUS+'(π*2py)¹|'+O2PLUS+'(π*2py)²',[
 '[KK](σ2s)²(σ*2s)²(σ2pz)²(π2px)²(π2py)²(π*2px)¹',
 '(σ1s)²(σ*1s)²(σ2s)²(σ*2s)²(σ2pz)²(π2px)²(π2py)²(π*2py)¹',
 '(σ1s)²(σ*1s)²(σ2s)²(σ*2s)²(σ2px)²(π2py)²(π2pz)²(π*2py)¹',
 '[KK](σ2s)²(σ*2s)²(σ2px)²(π2py)²(π2pz)²(π*2py)¹'
 ],{formula:'mo'});}
cf('mid2020',1,4,10,'冬季施工时往水泥中加入无机盐的目的，以及海水净化常用技术：',[
 cb('加入盐的目的','降低凝固点','提高凝固点|降低沸点|消除渗透压',['防冻','降低水的凝固点','防止冻结']),cb('海水净化技术','反渗透','正渗透|单纯过滤|离心',['反渗透法','反渗透技术'])], '盐增加有效溶质粒子浓度，使水的凝固点降低；反渗透用超过渗透压差的外压使水通过膜。');
cf('mid2020',2,4,10,'50.0 L 容器内有 140.0 g CO、20.0 g H₂，300 K。按 M(CO)=28、M(H₂)=2 g/mol，求分压。',[
 numBlank('CO 分压 / kPa',249.4,'748.3|499|124.7',.6),numBlank('H₂ 分压 / kPa',498.8,'249.4|748.3|49.88',.6)],'pᵢ=nᵢRT/V。CO 为 5 mol、H₂ 为 10 mol；取 R=8.314 kPa·L/(mol·K)，依次约 249、499 kPa。');
cf('mid2020',3,4,10,'指出以下分子间的作用力类型：',[
 cb('苯与 CH₄','色散力','取向力和色散力|氢键|诱导力和取向力',['只有色散力']),cb('乙醇与甲醇','色散力、取向力、诱导力、氢键','只有氢键|色散力和诱导力|色散力、取向力、诱导力',['分子间力和氢键','范德华力和氢键'],{set:true})],'苯、甲烷都是非极性分子；两种醇均有永久偶极和 O—H，可形成氢键，且仍有色散力等作用。');
cf('mid2020',4,4,10,'已知：①Fe₂O₃+3CO→2Fe+3CO₂，ΔH₁=−27.61；②3Fe₂O₃+CO→2Fe₃O₄+CO₂，ΔH₂=−58.58；③Fe₃O₄+CO→3FeO+CO₂，ΔH₃=38.07（均为 kJ/mol，固体铁氧化物，CO、CO₂ 为气体）。求 FeO+CO→Fe+CO₂ 的反应焓。',[
 numBlank('ΔᵣH°ₘ / (kJ/mol)',-16.73,'16.73|-48.12|-27.61',.02)],'目标反应=①/2−②/6−③/3，焓变同样线性组合，结果 −16.7317 kJ/mol。');
cf('mid2020',5,4,10,'298 K，按题给数据，1 mol 甲烷完全燃烧放热 965.6 kJ。填写热化学方程式（沿用题给热量）。',[
 cb('方程式，写明物态及 ΔH（kJ/mol）','CH₄(g)+2O₂(g)→CO₂(g)+2H₂O(l); ΔH=−965.6 kJ/mol','CH₄(g)+O₂(g)→CO₂(g)+H₂O(l); ΔH=−965.6 kJ/mol|CH₄(g)+2O₂(g)→CO₂(g)+2H₂O(l); ΔH=+965.6 kJ/mol|CH₄(g)+2O₂(g)→CO₂(g)+2H₂O(g); ΔH=−965.6 kJ/mol',[],{formula:'reaction'})], '配平为 1:2:1:2，298 K 完全燃烧产物水取液态，放热 ΔH<0。题给 965.6 不是常见标准甲烷燃烧焓数值，本题只据给定条件书写，不将它作为常数记忆。');
cf('mid2020',6,4,10,'26 号元素的核外电子排布、周期、族与分区：',[
 feBlank(),period4(),cb('族（旧式或现代编号）','VIII','IIA|VIB|VIIA',['Ⅷ','VIII族','Ⅷ族','8','第8族','VIIIB']),cb('分区','d','s|p|ds',['d区'])],'26 号为 Fe。最大 n=4，因此第四周期；旧式 VIII 族、现代第 8 族，属于 d 区。');
cf('mid2020',7,5,11,'按课程杂化轨道模型填写 PCl₃ 与 ICl₂⁻ 的构型及中心原子杂化：',[
 cb('PCl₃ 构型','三角锥形','平面三角形|正四面体|直线形',['三角锥','三角锥型']),cb('P 的杂化','sp³','sp²|sp|sp³d',['不等性sp³','sp³不等性杂化']),cb('ICl₂⁻ 构型','直线形','V形|三角锥形|T形',['直线型','直线']),cb('I 的形式杂化描述','sp³d','sp³|sp²|sp³d²')],'PCl₃ 为 AX₃E，有 4 个电子域；ICl₂⁻ 为 AX₂E₃，有 5 个电子域，三对孤电子占赤道位置，两个 Cl 呈直线。超价分子的 sp³d 是本课程形式模型。');
cf('mid2020',8,5,11,'从离子极化角度解释：NaCl 易溶于水，CuCl 难溶。',[
 cb('关键原因','Cu⁺ 极化力较强，使 CuCl 共价性增强','Na⁺ 极化力更强，使 NaCl 共价性增强|CuCl 完全没有离子作用|Cl⁻ 在 CuCl 中不能变形',['Cu+极化能力强，CuCl共价性强','Cu+极化力强，CuCl共价性增强'],{keywords:[['cu+','cu⁺','亚铜'],['极化'],['强'],['共价']]})],'Cu⁺ 的 d¹⁰ 电子结构使其对 Cl⁻ 的极化比 Na⁺ 更强，CuCl 共价性较大。溶解度实际还由晶格破坏与水合的自由能共同决定，不能把极化当成唯一因素。');
cf('mid2020',9,5,11,'乙烯中碳原子的杂化及 C=C 所含键：',[
 cb('碳的杂化','sp²','sp|sp³|sp³d'),cb('第一种键（沿键轴重叠）','σ','π|δ|氢键',['sigma','σ键']),cb('第二种键（侧向重叠）','π','σ|δ|离子键',['pi','π键'])],'每个 C 用三条 sp² 轨道形成 σ 键；未杂化 p 轨道侧向重叠形成 π 键，双键=一个 σ+一个 π。');
cf('mid2020',10,5,11,'填写二氯化六氨合钴(II)的化学式，以及 Na₂[SiF₆] 的名称和配位信息。',[
 cb('二氯化六氨合钴(II)化学式','[Co(NH₃)₆]Cl₂','[CoCl₂(NH₃)₄]|[Co(NH₃)₆]Cl₃|CoCl₂·4NH₃'),cb('Na₂[SiF₆]名称','六氟合硅(IV)酸钠','氟化六钠合硅|六氟合硅(II)酸钠|六氟化硅钠',['六氟合硅酸钠','六氟合硅(Ⅳ)酸钠']),cb('Si 氧化数','+4','+2|-4|+6',['4','IV']),numBlank('Si 配位数',6,'2|4|8',0),cb('配位原子','F','Si|Na|N',['氟','氟原子'])],'[SiF₆]²⁻ 中六个 F 各 −1，故 Si 为 +4；六个 F 直接配位，配位数为 6。');
cf('mid2020',11,5,11,'写出 O₂⁺ 的分子轨道排布、键级和磁性：',[
 moBlank(),numBlank('键级',2.5,'2|1.5|3',0),cb('磁性','顺磁性','抗磁性|铁磁性|无磁性',['顺磁','顺'])],'O₂ 失去一个 π* 反键电子，键级由 2 增为 2.5；剩一个未配对电子，所以顺磁。x、y 两个简并 π* 轨道任选一个放单电子。');
cf('mid2020',12,5,11,'按 VSEPR 填写 XeF₄：',[
 numBlank('中心原子价层电子对数',6,'4|5|8',0),numBlank('孤对电子对数',2,'0|1|4',0),cb('分子空间构型','平面正方形','正四面体|正八面体|三角双锥',['平面四方形','平面四方','平面正方'])],'Xe 有 8 个价电子，形成四个单键后余两对孤电子；6 个电子域八面体排列，两孤对占相对位置。');
cf('mid2018',1,14,20,'写出反应焓等于 AgCl(s) 标准摩尔生成焓的反应式：',[
 cb('由参考态单质生成 1 mol AgCl','Ag(s)+½Cl₂(g)→AgCl(s)','2Ag(s)+Cl₂(g)→2AgCl(s)|Ag(g)+½Cl₂(g)→AgCl(s)|Ag(s)+½Cl₂(l)→AgCl(s)',[],{formula:'reaction'})],'必须由参考态单质生成恰好 1 mol 指定物质；反应倍乘后反应焓也倍乘。');
cf('mid2018',2,14,20,'K[PtCl₅(NH₃)] 的配位信息：',[
 cb('名称','五氯·氨合铂(IV)酸钾','氯化五氨合铂(II)|五氯·氨合铂(II)酸钾|五氯·氨合铂(IV)酸钠',['五氯一氨合铂(IV)酸钾','五氯氨合铂(Ⅳ)酸钾']),cb('中心离子','Pt⁴⁺','Pt²⁺|K⁺|Pt⁰',['Pt4+','铂(IV)','四价铂离子']),cb('配体','Cl⁻、NH₃','Cl⁻、K⁺|NH₄⁺、Cl⁻|K⁺、NH₃',['氯离子、氨'],{set:true}),cb('配位原子','Cl、N','Cl、H|K、N|Pt、N',['氯、氮'],{set:true})],'配离子电荷 −1，五个 Cl⁻ 共 −5，NH₃ 中性，故 Pt 为 +4；NH₃ 通过 N 配位。');
cf('mid2018',3,14,21,'已知 C₃H₈(g)+5O₂(g)→3CO₂(g)+4H₂O(l)，ΔH=−2219.9 kJ/mol；ΔfH°(CO₂,g)=−393.5、ΔfH°(H₂O,l)=−285.8 kJ/mol，求丙烷生成焓。',[
 numBlank('ΔfH°ₘ(C₃H₈,g) / (kJ/mol)',-103.8,'103.8|-4543.6|-2219.9',.1)],'ΔH燃烧=3ΔfH(CO₂)+4ΔfH(H₂O)−ΔfH(C₃H₈)，移项得到 −103.8。');
cf('mid2018',4,14,21,'离子极化强弱一般取决于：',[
 cb('正离子的','极化力','变形性|电负性差|色散力',['极化能力']),cb('负离子的','变形性','方向性|饱和性|取向力',['可极化性','极化率','变形能力'])],'极化力指使别人的电子云变形的能力；变形性指自己的电子云被扭曲的难易。');
cf('mid2018',5,14,21,'某元素外层电子构型为 4s²4p²，填写周期和族。',[
 period4(),cb('族','IVA','IIA|IVB|VIA',['ⅣA','14','第14族','IVA族'])],'最大 n=4；主族价电子为 4 个，对应 IVA（现代第14族），元素为 Ge。');
cf('mid2015',1,25,33,'HBr 分子的 σ 键由哪些原子轨道重叠形成？',[
 cb('H 的轨道','1s','2s|1p|2p'),cb('Br 的轨道','4p','3p|4s|3d')],'H 的价轨道为 1s，Br 的未成对价电子位于 4p；沿键轴重叠形成 σ 键。');
cf('mid2015',2,25,33,'[Co(NO₂)(NH₃)₅]SO₄（NO₂ 通过 N 配位）的配位信息：',[
 cb('名称','硫酸硝基·五氨合钴(III)','硫酸亚硝酸根·五氨合钴(II)|硫酸硝基·五氨合钴(II)|硫酸硝基·四氨合钴(III)',['硫酸硝基五氨合钴(Ⅲ)']),cb('中心离子','Co³⁺','Co²⁺|Co⁰|S⁶⁺',['Co3+','三价钴离子']),cb('配体','NO₂⁻、NH₃','SO₄²⁻、NH₃|NO₃⁻、NH₃|NO₂⁻、NH₄⁺',[],{set:true}),cb('配位原子','N','O|S|H',['氮','氮原子'])],'外界 SO₄²⁻ 使配离子带 +2，NO₂⁻ 带 −1，故 Co 为 +3。题设硝基为 N 配位。原答案仅写 Co，作为“中心离子”应补电荷。');
cf('mid2015',3,25,33,'M²⁺ 的 3d 轨道有 6 个电子，M 为相应第四周期过渡元素。填写中性原子排布及周期。',[
 feBlank('M 原子完整排布或稀有气体简写'),period4()],'M 为 Fe，Fe²⁺ 为 [Ar]3d⁶；中性原子应补上 4s²，为 [Ar]3d⁶4s²。原答案只写 3d⁶，遗漏了原子与离子的区别。');
cf('mid2015',4,26,33,'已知：①C₂H₂(g)+⁵⁄₂O₂(g)→2CO₂(g)+H₂O(g)，ΔH₁=−1246.2；②C(s)+2H₂O(g)→CO₂(g)+2H₂(g)，ΔH₂=90.9；③2H₂O(g)→2H₂(g)+O₂(g)，ΔH₃=483.6，均为 kJ/mol。求 C₂H₂(g) 标准摩尔生成焓。',[
 numBlank('ΔfH°ₘ / (kJ/mol)',219,'-219|226.7|1246.2',.1)],'由③得水蒸气生成焓 −241.8；由②得 CO₂ 生成焓 90.9−483.6=−392.7；再由①得 2(−392.7)−241.8+1246.2=219.0。沿用原题给定数值。');
cf('mid2015',5,26,33,'按题面给定物态：2 mol NH₃(g) 与 2 mol HCl(g) 生成 2 mol NH₄Cl(g)，总放热 352.2 kJ。写出生成 1 mol NH₄Cl(g) 的热化学方程式。',[
 cb('方程式及 ΔH / (kJ/mol)','NH₃(g)+HCl(g)→NH₄Cl(g); ΔH=−176.1 kJ/mol','NH₃(g)+HCl(g)→NH₄Cl(g); ΔH=−352.2 kJ/mol|NH₃(g)+HCl(g)→NH₄Cl(g); ΔH=+176.1 kJ/mol|2NH₃(g)+2HCl(g)→2NH₄Cl(g); ΔH=−176.1 kJ/mol',[],{formula:'reaction'})],'1 mol 对应一半总热量，放热取负。保留原题 NH₄Cl(g) 的假设；常温常见产物为固体，不把题给数据当通用物性值。','原“2 mol …放出热量 352.2 kJ·mol⁻¹”的单位混用，整理为该次过程总放热 352.2 kJ。');
cf('mid2023',1,2,5,'原子序数 26 的元素及所在分区信息：',[
 period4(),cb('族','VIII','IIA|VIB|VIIA',['Ⅷ','8','第8族','VIII族','VIIIB']),cb('区','d','s|p|ds',['d区']),cb('本资料采用的 d 区价电子构型通式','(n−1)d¹～¹⁰ns⁰～²','ns²np¹～⁶|(n−2)f¹～¹⁴ns²|(n−1)d¹⁰ns¹～²',['(n-1)d1-10ns0-2','(n-1)d1~10ns0~2']),feBlank(),cb('单质固体晶体类型','金属晶体','离子晶体|分子晶体|共价晶体',['金属'])],'Fe 的基态为 [Ar]3d⁶4s²，第四周期、VIII（现代8）族、d区。d 区通式按原资料的宽泛写法记录；具体分区对 d¹⁰ 元素另有 ds 区约定。');
cf('mid2023',2,2,5,'O₂ 失去一个电子得到 O₂⁺，填写轨道排布、键级及性质。',[
 moBlank(),numBlank('键级',2.5,'2|1.5|3',0),cb('按键级比较，键的稳定性比 O₂','大','小|相同|无法用键级作任何比较',['大于','更大','较大']),cb('是否有顺磁性','有','无|只有外场下才出现未配对电子',['具有','是'])],'失去的是反键电子，键级提高，按基础模型键更强；仍有一个未配对电子。这里“稳定性”特指键强弱，不表示离子在任意环境比中性分子更稳定。');
cf('mid2023',3,2,5,'氧原子与水分子的电子结构：',[
 cb('O 基态电子排布','1s²2s²2p⁴','1s²2s²2p⁶|1s²2s¹2p⁵|1s²2s²2p²',['[He]2s²2p⁴']),cb('水中 O 的杂化','不等性 sp³','sp²|sp|等性 sp³',['sp³','sp³不等性杂化','非等性sp³']),numBlank('形成的杂化轨道数',4,'2|3|6',0),cb('O—H 键类型','σ','π|δ|氢键',['sigma','σ键']),cb('水分子构型','V形','直线形|三角锥形|正四面体',['V型','折线形','角形','弯曲形'])],'四个 sp³ 轨道中两个形成 σ 键、两个被孤对电子占据；电子域近四面体，原子构型为 V 形。');
cf('mid2023',4,3,5,'配合物 [Cu(NH₃)₄]SO₄：',[
 cb('名称','硫酸四氨合铜(II)','硫酸四氨合铜(I)|四氨合硫酸铜|硫酸六氨合铜(II)',['硫酸四氨合铜','硫酸四氨合铜(Ⅱ)']),cb('中心离子','Cu²⁺','Cu⁺|Cu⁰|S⁶⁺',['Cu2+','二价铜离子']),cb('配体分子','NH₃','NH₄⁺|SO₄²⁻|H₂O',['氨','氨分子']),cb('配位原子','N','H|O|S',['氮','氮原子']),numBlank('配位数',4,'2|5|6',0)],'SO₄²⁻ 在外界；四个中性 NH₃ 通过 N 的孤对电子与 Cu²⁺ 配位。');
cf('mid2023',5,3,5,'填写水分子间作用力与氢键的一般特点：',[
 cb('水分子间作用','范德华力和氢键','只有氢键|只有色散力|离子键和金属键',['分子间力和氢键','分子间作用力和氢键','色散力、取向力、诱导力、氢键']),cb('氢键的第一特性','方向性','无限延展性|非定向性|金属性',['方向']),cb('氢键的第二特性','饱和性','无饱和性|无限配位性|导电性',['饱和']),cb('分子间氢键通常使熔沸点','升高','降低|不变|一律变为零',['提高','增加']),cb('分子内氢键相对类似分子间氢键体系，熔沸点可能','降低','升高|不变|无法发生相变',['下降'])],'氢键有方向和数量约束；分子间氢键提高分离分子的代价，分子内氢键可减少分子间缔合。熔点还受晶体堆积影响，规律应在相似结构间使用。');
cf('mid2023',6,3,5,'石墨的结构与性质：',[
 cb('晶体类型（本课分类）','混合型晶体','纯分子晶体|纯离子晶体|金属晶体',['混合晶体','混合型']),cb('层内碳杂化','sp²','sp|sp³|sp³d'),numBlank('层内键角 / °',120,'109.5|90|180',0),cb('未杂化 p 电子形成','离域大π键','氢键|离子键|局域σ键',['大π键','离域π键']),cb('由此具有的能力','导电','绝缘|形成离子|溶于水',['导电能力','导电性'])],'层内由强共价键连接，层间主要为较弱作用；p 电子离域使石墨有沿层方向导电的能力。');
cf('mid2023',7,3,5,'沿用试卷模型：100 ℃ 下水在沸点可逆汽化，题给汽化焓 44.0 kJ/mol；蒸气视为理想气体，忽略液体体积。填摩尔量以及 2 mol 水汽化的功。',[
 numBlank('ΔHₘ / (kJ/mol)',44,'-44|88|40.9',.05),numBlank('ΔSₘ / (J/(mol·K))',118,'0|0.118|440',.2),numBlank('ΔUₘ / (kJ/mol)',40.9,'44|47.1|-40.9',.1),numBlank('ΔGₘ / (kJ/mol)',0,'44|-44|40.9',0),numBlank('2 mol 汽化 W / kJ（环境对系统做功为正）',-6.20,'6.20|-3.10|-44',.03)],'T=373.15 K；ΔSₘ=ΔHₘ/T≈118；ΔUₘ=ΔHₘ−RT≈40.9；平衡可逆相变 ΔGₘ=0；W=−2RT≈−6.20 kJ。','沿用原题给定 44.0，不将其当作 100 ℃ 水的真实汽化焓常数；用“沸点平衡汽化”明确 ΔG=0 的条件。');
cf('mid2024',1,2,5,'24 号元素的基态电子排布和周期：',[
 cb('Cr 基态电子排布','[Ar]3d⁵4s¹','[Ar]3d⁴4s²|[Ar]3d⁶|[Ar]3d³4s³',['1s²2s²2p⁶3s²3p⁶3d⁵4s¹','[Ar]4s¹3d⁵']),period4()],'Cr 采用半充满 3d⁵ 配合 4s¹ 的基态构型；最大 n 为 4。');
cf('mid2024',2,2,5,'O₂ 的磁性、同周期有相同磁性的另一种同核双原子分子，以及后者的键级：',[
 cb('O₂ 磁性','顺磁性','抗磁性|铁磁性|无磁性',['顺磁']),cb('另一分子','B₂','C₂|N₂|F₂'),numBlank('上一空分子的键级',1,'0|2|3',0)],'O₂ 的两个 π* 单电子导致顺磁；B₂ 的两个 π 成键单电子也导致顺磁，B₂ 键级为 1。最后一空问 B₂，不是 O₂。');
cf('mid2024',3,2,5,'比较 CO、HBr、H₂O 分子的分子间作用；色散部分按相同分子间距离下的 London 近似比较：',[
 cb('取向力最大','H₂O','HBr|CO'),cb('取向力最小','CO','HBr|H₂O'),cb('色散力最大','HBr','H₂O|CO'),cb('色散力最小','H₂O','HBr|CO')],'取向力看永久偶极，水最大、CO 最小。NIST 的实验极化率体积：H₂O 1.501、CO 1.953、HBr 3.616 Å³。相同距离下，London 近似色散强度随极化率平方及特征激发能增大，本组比较为 HBr>CO>H₂O。','原答案把色散力最小写为 CO；这里补充相同距离与 London 近似的条件，订正为 H₂O。不要混淆取向力、色散力和包含氢键的总作用。');
CHEM_COMPLETE.find(q=>q.id==='mid2024-F3').reference='https://cccbdb.nist.gov/pollistx.asp';
cf('mid2024',4,3,6,'NH₃ 的四个杂化轨道中，一个被一对非成键电子占据：',[
 cb('杂化类型','sp³','sp²|sp|sp³d'),cb('该电子对名称','孤对电子','成键电子|自由电子|内层电子',['孤对','孤电子对']),cb('该种杂化称为','不等性杂化','等性杂化|d轨道杂化|无杂化',['非等性杂化','不等性','非等性']),cb('分子构型','三角锥形','平面三角形|正四面体|T形',['三角锥','三角锥型'])],'四个电子域中一对孤对、三个成键域；孤对不计入原子空间形状，故为三角锥。');
cf('mid2024',5,3,6,'按 VSEPR 预测 ClF₃ 的分子构型。',[
 cb('分子构型','T形','三角锥形|平面三角形|三角双锥',['T型','T字形'])],'Cl 有 5 个电子域，三成键、两孤对；孤对占赤道位置，三个 F 呈 T 形。原答案后的问号不影响该结论。');
cf('mid2024',6,3,6,'某基态原子有 3 个价电子，其中一个价电子量子数 n=3、l=2、mₗ=+2、mₛ=+½。',[
 numBlank('原子序数',21,'23|13|31',0),cb('价电子排布','3d¹4s²','3d³|3d²4s¹|3s²3p¹',['4s²3d¹'])],'该电子在 3d 亚层；三价电子的相应元素为 Sc，[Ar]3d¹4s²，原子序数 21。');
cf('mid2024',7,3,6,'298 K，1 mol NaCl 溶于 1 L 水，所得溶液未饱和。比较该溶解过程的 ΔG、ΔS 与零。',[
 cb('ΔG 与 0 的关系','<','>|=',['＜','小于','小于0']),cb('ΔS 与 0 的关系','>','<|=',['＞','大于','大于0'])],'NaCl 在该条件下自发溶解，ΔG<0；NaCl 溶解的熵变为正。不是所有盐溶解都必然熵增，水合有序化也会影响熵。');
cf('mid2024',8,3,6,'按课程离子极化规律比较：',[
 cb('AgCl、AgBr 中分解温度较高者','AgCl','AgBr|二者一样'),cb('MgCl₂、AlCl₃ 中熔点较低者','AlCl₃','MgCl₂|二者一样')],'Br⁻ 比 Cl⁻ 更易变形，AgBr 的热稳定性较低；Al³⁺ 极化力强，AlCl₃ 共价性显著，熔点较低。');
cf('mid2024',9,3,6,'CaCO₃(s)→CaO(s)+CO₂(g)，ΔH°=178 kJ/mol、ΔS°=160 J/(mol·K)。忽略随温度变化，在 CO₂ 为标准压力的模型下求转换温度。',[
 numBlank('T / K',1112.5,'1.1125|839.35|178000',.6)],'令 ΔG°=0，T=ΔH°/ΔS°=178000/160=1112.5 K。实际开始分解温度还受 CO₂ 分压和动力学影响。','补充标准压力与焓熵不变近似，避免把转换温度当作任意环境唯一分解温度。');
cf('mid2024',10,3,6,'Zn+½O₂→ZnO 的 ΔH°为 −351 kJ/mol；Hg+½O₂→HgO 为 −90.8 kJ/mol。求 Zn+HgO→ZnO+Hg 的 ΔH°。',[
 numBlank('ΔH° / (kJ/mol)',-260.2,'260.2|-441.8|441.8',.1)],'第一反应减去第二反应，ΔH°=−351−(−90.8)=−260.2。');
cf('mid2024',11,3,6,'[Co(H₂O)₄Cl₂]Cl 的名称与配位信息：',[
 cb('名称','氯化二氯·四水合钴(III)','氯化二氯·四水合钴(II)|氯化四氯·二水合钴(III)|二氯化二氯·四水合钴(III)',['氯化二氯四水合钴(Ⅲ)']),cb('中心离子','Co³⁺','Co²⁺|Co⁺|Cl⁻',['Co3+','三价钴离子']),cb('H₂O 的配位原子','O','H|Co|Cl',['氧','氧原子'])],'外界 Cl⁻ 要求配离子 +1，内界两个 Cl⁻ 共 −2，故 Co 为 +3；水用 O 的孤对电子配位。原答案写 Co/钴是中心元素的简写，中心离子需写电荷。');

function completeNormalize(value){
 return String(value??'').replace(/½/g,'1/2').normalize('NFKC').toLowerCase().replace(/[−–—]/g,'-').replace(/[～〜]/g,'~').replace(/[·⋅\s^_{}]/g,'').replace(/（/g,'(').replace(/）/g,')').replace(/∗/g,'*').replace(/⁄/g,'/').replace(/σ/g,'sigma').replace(/π/g,'pi');
}
function completeMO(value){
 let s=completeNormalize(value).replace(/\[kk\]/g,'(sigma1s)2(sigma*1s)2');
 // Parse occupancies instead of comparing typography: allow either axis and either degenerate π* orbital.
 const re=/\(?(sigma|pi)(\*)?(1s|2s|2p)([xyz])?(\*)?\)?([12])/g;
 let m,parts=[];while((m=re.exec(s)))parts.push({type:m[1],star:!!(m[2]||m[5]),shell:m[3],axis:m[4]||'',n:+m[6]});
 if(s.replace(re,'')||parts.length!==8)return false;
 const count=(type,star,shell)=>parts.filter(x=>x.type===type&&x.star===star&&x.shell===shell);
 for(const shell of ['1s','2s'])for(const star of [false,true]){const a=count('sigma',star,shell);if(a.length!==1||a[0].n!==2)return false;}
 const sig=count('sigma',false,'2p'),pi=count('pi',false,'2p'),anti=count('pi',true,'2p');
 return sig.length===1&&sig[0].n===2&&pi.length===2&&pi.every(x=>x.n===2)&&anti.length===1&&anti[0].n===1&&new Set([sig[0].axis,...pi.map(x=>x.axis)]).size===3&&['x','y','z'].includes(sig[0].axis)&&pi.some(x=>x.axis===anti[0].axis);
}
function completeReaction(value){
 return completeNormalize(value).replace(/(?:→|⟶|->|＝)/g,'=').replace(/δ(?:rh|h)(?:[°⊖θ])?(?:m)?|∆(?:rh|h)(?:[°⊖θ])?(?:m)?|Δ(?:rh|h)(?:[°⊖θ])?(?:m)?/gi,'dh').replace(/k[jj](?:\/mol|mol-1)/g,'').replace(/[;；，,]/g,'').replace(/1\/2cl2/g,'0.5cl2').replace(/0\.5cl2/g,'(half)cl2');
}
function completeBlankCorrect(b,value){
 const n=completeNormalize(value);if(!n)return false;
 if(b.numeric){
  // Units are specified alongside each input; an optional matching unit is accepted.
  const match=n.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)(.*)$/);if(!match)return false;
  const raw=match[1],unit=match[2],label=completeNormalize(b.label);
  if(unit){const allowed=label.includes('kj/mol')?['kj/mol','kjmol-1']:label.includes('j/(molk)')?['j/(molk)','j/mol/k','jmol-1k-1']:label.includes('kpa')?['kpa']:label.includes('/kj')?['kj']:label.includes('/k')?['k']:label.includes('/°')?['°','度']:[];if(!allowed.includes(unit))return false;}
  if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/.test(raw))return false;
  return Math.abs(Number(raw)-Number(b.answer))<=b.tolerance+1e-9;
 }
 if([b.answer,...b.aliases].some(x=>completeNormalize(x)===n))return true;
 if(b.formula==='mo')return completeMO(value);
 if(b.formula==='reaction')return completeReaction(value)===completeReaction(b.answer);
 if(b.set){const sorted=x=>completeNormalize(x).split(/[、,，;；和与及]+/).filter(Boolean).sort().join('|');if([b.answer,...b.aliases].some(x=>sorted(x)===sorted(value)))return true;}
 // Long explanations use conservative concept matching; negation must not receive credit.
 if(b.keywords&&!/[不无没]|较弱|更弱|弱于/.test(n))return b.keywords.every(group=>group.some(k=>n.includes(completeNormalize(k))));
 return false;
}
function completeResult(q,a){
 if(!a?.submitted)return null;
 if(q.blanks)return q.blanks.map((b,i)=>completeBlankCorrect(b,a.values[i]));
 return [Array.isArray(a.values)&&a.values.length===q.answers.length&&q.answers.every(i=>a.values.includes(i))];
}
function completeAllCorrect(q,a){const r=completeResult(q,a);return !!r&&r.every(Boolean);}
function normalizeCompleteAnswers(raw){
 const out={};if(!raw||typeof raw!=='object')return out;
 for(const q of allChemCompleteQuestions()){const a=raw[q.id];if(!a||!Array.isArray(a.values))continue;
  const values=q.blanks?a.values.slice(0,q.blanks.length).map(v=>typeof v==='string'?v.slice(0,1500):''):[...new Set(a.values.filter(v=>Number.isInteger(v)&&v>=0&&v<q.options.length))];
  if(q.blanks&&values.length!==q.blanks.length)continue;
  out[q.id]={values,submitted:a.submitted===true,mode:a.mode==='text'?'text':'choice'};
 }return out;
}
function completeShuffle(list){const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
let completeMode='choice',completeOrders={},completeRefresh=null;
function completeQuestionHTML(q){
 const a=state.completeExamAnswers[q.id],done=!!a?.submitted,results=completeResult(q,a),paper=CHEM_EXAM_PAPERS.find(p=>p.id===q.paper),e=escapeHTML;
 const mode=done?a.mode:completeMode;
 const inputs=q.blanks?q.blanks.map((b,i)=>{
  const value=a?.values[i]??'',key=q.id+'-'+i;
  completeOrders[key]??=completeShuffle(b.options);
  const displayOptions=value&&!completeOrders[key].includes(value)?[value,...completeOrders[key]]:completeOrders[key];
  const answer=done?`<p class="${results[i]?'complete-pass':'complete-miss'}">${results[i]?'✓ 正确':'需核对'} · 你的答案：${e(value)}<br>参考答案：${e(b.answer)}</p>`:'';
  return `<div class="complete-blank"><label for="complete-${key}">${i+1}. ${e(b.label)}</label>${mode==='text'?`<input id="complete-${key}" data-complete-blank="${i}" autocomplete="off" value="${e(value)}" ${done?'disabled':''} placeholder="填写本空；数值按上方单位">`:`<select id="complete-${key}" data-complete-blank="${i}" ${done?'disabled':''}><option value="">请选择</option>${displayOptions.map(x=>`<option value="${e(x)}" ${x===value?'selected':''}>${e(x)}</option>`).join('')}</select>`}${answer}</div>`;
 }).join(''):`<div class="exam-choices">${q.options.map((o,i)=>`<label class="choice complete-option"><input type="${(q.multiple||['mid2015','mid2018'].includes(q.paper))?'checkbox':'radio'}" name="complete-${q.id}" data-complete-option="${i}" ${a?.values.includes(i)?'checked':''} ${done?'disabled':''}> <span>${String.fromCharCode(65+i)}. ${e(o)}</span></label>`).join('')}</div>`;
 const correctText=q.blanks?`答对 ${results?.filter(Boolean).length||0} / ${q.blanks.length} 空`:`正确选项：${q.answers.map(i=>String.fromCharCode(65+i)).join('、')}`;
 return `<article class="exam-question complete-question" id="complete-q-${q.id}" data-complete-q="${q.id}"><div class="exam-source-label">${e(q.sourceTitle||paper.year)} · ${q.blanks?'填空':q.number.startsWith('J')?'判断':'选择'}第 ${q.number.slice(1)} 题 <span class="pill">${q.blanks?q.blanks.length+' 空':(q.multiple||['mid2015','mid2018'].includes(q.paper))?'不定项选择（1 个或多个答案）':q.number.startsWith('J')?'判断':'单选'}</span></div><h3>${e(q.prompt)}</h3>${q.note?`<p class="notice">${done?'原题订正 / 条件说明：'+e(q.note):'本题已校正题干或补充适用条件，具体订正随解析显示。'}</p>`:''}${inputs}<p class="complete-validation" aria-live="polite"></p><div class="actions">${done?`<button class="btn secondary" data-complete-retry>重新做本题</button>`:`<button class="btn" data-complete-submit>提交本题</button>`}</div>${done?`<div class="feedback ${results.every(Boolean)?'correct':''}" tabindex="-1"><strong>${results.every(Boolean)?'✓ 回答正确':'再巩固一下'} · ${correctText}</strong><p>${e(q.explanation)}</p>${q.pointId?chemistryUnitPointLink(q):''}${q.reference?`<p><a href="${e(q.reference)}" target="_blank" rel="noopener">核对依据：NIST 实验极化率表（联网）</a></p>`:''}${q.blanks&&a.mode==='text'?'<p class="condition">文字答案按已收录的等价写法核对。未匹配时可先与参考答案对照，再重新作答；公式可使用普通数字、^、sigma/pi。</p>':''}<a href="${q.answerURL||examPaperURL(paper,q.answerPage)}">查看原参考答案 · 第 ${q.answerPage} 页</a></div>`:''}<div class="exam-source-links"><a href="${q.sourceURL||examPaperURL(paper,q.page)}">核对原题 · 第 ${q.page} 页</a></div></article>`;
}
function chemistryCompleteDrill(kind){
 chemExamDrillRefresh=null;
 const prefix=kind==='fill'?'F':'C';let order=CHEM_COMPLETE.filter(q=>q.number.startsWith(prefix)).sort((a,b)=>b.paper.localeCompare(a.paper)||Number(a.number.slice(1))-Number(b.number.slice(1))),page=0,found=[];
 const papers=CHEM_EXAM_PAPERS.filter(p=>p.type==='期中');
 shell(`<div class="crumb"><a href="#chem-exams">← 历年试卷</a></div><h1>期中 · ${kind==='fill'?'填空题':'选择题'}</h1>${chemistryTabs('exams')}${chemistryJudgmentLinks()}<p class="course-description">五套原卷已按原题号逐题整理：${order.length} 道${kind==='fill'?`填空大题，共 ${order.reduce((n,q)=>n+q.blanks.length,0)} 空`:'选择题'}。提交后显示解析，可按学年筛选。</p><div class="tools"><select id="completePaper" aria-label="选择学年"><option value="all">全部五套期中卷</option>${papers.map(p=>`<option value="${p.id}">${escapeHTML(p.year)} · ${order.filter(q=>q.paper===p.id).length} 题</option>`).join('')}</select><select id="completeStatus" aria-label="作答状态"><option value="all">全部题目</option><option value="new">未完成</option><option value="wrong">只看错题</option></select><input id="completeSearch" type="search" aria-label="搜索题目" placeholder="搜索题干、考点"></div><div class="actions"><button class="btn secondary" id="completeReset">重置当前学年本题型</button><button class="btn secondary" id="completeShuffle">打乱题目顺序</button>${kind==='fill'?'<label>填空方式 <select id="completeMode" aria-label="填空方式"><option value="choice">选项作答</option><option value="text">直接填空</option></select></label>':''}</div><p class="condition">${kind==='fill'?'每空单独作答、单独判分。切换方式会保留已填内容，选项顺序随机。':'2015、2018 年卷按原卷采用不定项选择，需选择所有正确项再提交。'} 重置清除所选学年该题型的作答；乱序保留进度。</p><p id="completeCount" aria-live="polite"></p><div id="completeList"></div><nav class="paper-pagination"><button id="completePrev" class="btn secondary">← 上一组</button><span id="completePages"></span><button id="completeNext" class="btn">下一组 →</button></nav>`,'大学化学 · 期中完整练习');
 function selected(){return order.filter(q=>$('#completePaper').value==='all'||q.paper===$('#completePaper').value);}
 function counter(){const qs=selected(),done=qs.filter(q=>state.completeExamAnswers[q.id]?.submitted),right=done.filter(q=>completeAllCorrect(q,state.completeExamAnswers[q.id]));$('#completeCount').textContent=`本学年范围：${qs.length} 题 · 已完成 ${done.length} · 全对 ${right.length} · 当前筛选 ${found.length} 题`+(kind==='fill'?` · 已答对 ${done.reduce((s,q)=>s+completeResult(q,state.completeExamAnswers[q.id]).filter(Boolean).length,0)} / ${qs.reduce((s,q)=>s+q.blanks.length,0)} 空`:'');}
 function render(reset=false){if(reset)page=0;const status=$('#completeStatus').value,query=$('#completeSearch').value.trim().toLowerCase();found=selected().filter(q=>{const a=state.completeExamAnswers[q.id];return(status==='all'||status==='new'&&!a?.submitted||status==='wrong'&&a?.submitted&&!completeAllCorrect(q,a))&&[q.prompt,q.explanation,...(q.blanks||[]).map(b=>b.label)].join(' ').toLowerCase().includes(query);});page=chemResumePage(found,6)??page;const pages=Math.ceil(found.length/6);page=Math.max(0,Math.min(page,pages-1));$('#completeList').innerHTML=found.slice(page*6,page*6+6).map(completeQuestionHTML).join('')||'<p>没有符合筛选条件的题目。</p>';$('#completePrev').disabled=page===0;$('#completeNext').disabled=page+1>=pages;$('#completePages').textContent=pages?`${page+1} / ${pages}`:'0 / 0';counter();}
 for(const id of ['completePaper','completeStatus','completeSearch'])$('#'+id).addEventListener(id==='completeSearch'?'input':'change',()=>render(true));
 $('#completePrev').onclick=()=>{page--;render();$('#completeCount').scrollIntoView();};$('#completeNext').onclick=()=>{page++;render();$('#completeCount').scrollIntoView();};
 $('#completeShuffle').onclick=()=>{order=completeShuffle(order);render(true);};
 $('#completeReset').onclick=()=>{for(const q of selected()){delete state.completeExamAnswers[q.id];for(let i=0;i<(q.blanks?.length||0);i++)delete completeOrders[q.id+'-'+i];}save();$('#completeStatus').value='all';render(true);};
 if($('#completeMode')){$('#completeMode').value=completeMode;$('#completeMode').onchange=()=>{completeMode=$('#completeMode').value;render();};}
 completeRefresh=counter;render();
}
function completeReadCard(q,card){return q.blanks?[...card.querySelectorAll('[data-complete-blank]')].map(x=>x.value):[...card.querySelectorAll('[data-complete-option]:checked')].map(x=>Number(x.dataset.completeOption));}
if(typeof document!=='undefined'){
 document.addEventListener('input',event=>{const card=event.target.closest('[data-complete-q]');if(!card)return;const q=allChemCompleteQuestions().find(q=>q.id===card.dataset.completeQ);if(!q||state.completeExamAnswers[q.id]?.submitted)return;state.completeExamAnswers[q.id]={values:completeReadCard(q,card),submitted:false,mode:completeMode};save();});
 document.addEventListener('click',event=>{
  const button=event.target.closest('[data-complete-submit],[data-complete-retry]');if(!button)return;const card=button.closest('[data-complete-q]'),q=allChemCompleteQuestions().find(q=>q.id===card.dataset.completeQ);if(!q)return;
  if(button.hasAttribute('data-complete-retry'))delete state.completeExamAnswers[q.id];
  else{const values=completeReadCard(q,card);if(!values.length||q.blanks&&values.some(v=>!v.trim())){card.querySelector('.complete-validation').textContent=q.blanks?'请完成每一空后提交。':'请至少选择一个选项。';return;}state.completeExamAnswers[q.id]={values,submitted:true,mode:completeMode};}
  if(button.hasAttribute('data-complete-submit'))trackCompleteMistake(q);
  save();card.outerHTML=completeQuestionHTML(q);if($('#completeCount'))completeRefresh?.();document.getElementById('complete-q-'+q.id)?.querySelector('.feedback')?.focus({preventScroll:true});
 });
}
