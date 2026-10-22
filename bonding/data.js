"use strict";
/* ================= data: words, checks, quiz, lab, molecules ================= */
const WORDS={
  term:['Dotted words','Tap any word with a dotted line under it and a short, simple meaning pops up. Tap again or anywhere else to close it.'],
  atom:['Atom','The smallest particle of an element: a tiny positive nucleus with electrons around it.'],
  nucleus:['Nucleus','The center of an atom. It holds the protons (positive) and the neutrons.'],
  electron:['Electron','A tiny negative particle around the nucleus. Bonding is all about what electrons do.'],
  shell:['Shell','A level that electrons sit in around the nucleus. Only the outer shell takes part in bonding.'],
  orbital:['Orbital','A region where an electron is likely to be found. Think of it as a room that holds at most 2 electrons.'],
  sorb:['s orbital','A ball-shaped orbital. Every shell has one.'],
  porb:['p orbital','A dumbbell-shaped orbital with two lobes. From shell 2 onward there are three of them, at right angles to each other.'],
  ion:['Ion','An atom that has lost or gained electrons, so it has a charge. Lost electrons: positive. Gained electrons: negative.'],
  lattice:['Giant lattice','A huge, regular 3D pattern of particles that repeats in every direction.'],
  covalent:['Covalent bond','A pair of electrons shared between two atoms, usually one electron from each.'],
  bondpair:['Bonding pair','A pair of electrons shared between two atoms. It is the bond.'],
  lonepair:['Lone pair','A pair of outer electrons that belongs to one atom and is not used in a bond.'],
  dative:['Dative covalent bond','A covalent bond where both shared electrons come from the same atom. Drawn as an arrow.'],
  octet:['Octet','Eight electrons in the outer shell, like a noble gas.'],
  unpaired:['Unpaired electron','An electron alone in its orbital. It can pair up with an electron from another atom to make a bond.'],
  promotion:['Promotion','Moving an electron up into an empty orbital of slightly higher energy, here from 2s to 2p.'],
  hybrid:['Hybrid orbital','A new orbital made by mixing an s orbital with p orbitals. All the hybrids made together are identical. Each has one big lobe and one small lobe.'],
  sigma:['σ (sigma) bond','A bond made by head-on overlap. The shared electrons sit on the line between the two nuclei. Every single bond is a σ bond.'],
  pi:['π (pi) bond','A bond made by sideways overlap of two p orbitals. The shared electrons sit above and below the line between the nuclei.'],
  overlap:['Overlap','When orbitals from two atoms share the same space. The shared electrons sit in the overlap.'],
  region:['Region of electron density','A place around an atom where electrons are bunched up: a single bond, a double bond, a triple bond or a lone pair. Each counts as one.'],
  en:['Electronegativity','How strongly an atom in a covalent bond pulls the shared electrons toward itself.'],
  dipole:['Dipole','A bond or molecule with a slightly positive end (δ+) and a slightly negative end (δ−).'],
  delocalized:['Delocalized','Not stuck to one atom. Free to move through the whole structure.'],
  hbond:['Hydrogen bond','A strong attraction between molecules, for example between water molecules. It is not a covalent bond.'],
  vdw:['van der Waals forces','Weak attractions between molecules.']
};
const CHECKS={
  c0:{q:'Nitrogen is element 7, so it has 7 electrons. Which is its address (configuration)?',o:['1s² 2s² 2p³','1s² 2s² 2p⁵','1s² 2p⁵','1s⁷'],a:0,x:'2 go in 1s, 2 go in 2s, and the last 3 go into the three 2p rooms, one in each. Small numbers add up: 2 + 2 + 3 = 7.'},
  c0b:{q:'In 3p⁴, what does the small 4 mean?',o:['There are 4 electrons in the 3p rooms','It is floor (shell) 4','There are 4 p rooms','The atom makes 4 bonds'],a:0,x:'The big number (3) is the floor, the letter (p) is the room type, and the small raised number (4) counts the electrons in those rooms.'},
  c1:{q:'Magnesium oxide, MgO, is made from a metal and a non-metal. What type of bonding does it have?',o:['Ionic','Covalent','Metallic'],a:0,x:'Metal + non-metal → ionic. Mg passes 2 electrons to O.'},
  c2:{q:'What is the formula of aluminium sulfate? (Al³⁺ and SO₄²⁻)',o:['Al₂(SO₄)₃','Al₃(SO₄)₂','AlSO₄','Al₂SO₄₃'],a:0,x:'The lowest number both 3 and 2 go into is 6. Two Al³⁺ make +6, three SO₄²⁻ make −6. Brackets, because there is more than one sulfate.'},
  c2b:{q:'Why does MgO have a much higher melting point than NaCl?',o:['Mg²⁺ and O²⁻ are smaller and more highly charged, so they attract more strongly','MgO has covalent bonds','MgO molecules are heavier','NaCl has delocalized electrons'],a:0,x:'Smaller ions get closer, and 2+ / 2− charges pull harder than 1+ / 1−. More energy is needed to separate them.'},
  c3:{q:'In the ammonium ion, NH₄⁺, how many bonds are dative, and how do the four N–H bonds compare at the end?',o:['1 dative bond, and all four N–H bonds end up identical','4 dative bonds','1 dative bond, which stays weaker than the others','No dative bonds'],a:0,x:'The N lone pair goes to H⁺: one dative bond. Once formed it is the same as the others, and the + charge is spread over the whole ion.'},
  c4:{q:'Which carbon–carbon bond is the shortest and strongest?',o:['C–C','C=C','C≡C'],a:2,x:'A triple bond has the most electrons between the nuclei, so the pull is strongest and the atoms are closest.'},
  c5a:{q:'Oxygen is 1s² 2s² 2p⁴. How many unpaired electrons does it have, and so how many bonds can it make?',o:['0','1','2','4'],a:2,x:'The four 2p electrons fill the boxes as ↑↓ ↑ ↑. Two are single, so O makes 2 bonds, as in H₂O.'},
  c5b:{q:'After promotion, carbon\'s outer electrons are arranged as',o:['2s² 2p²','2s¹ 2p³','2s⁰ 2p⁴','2s² 2p³'],a:1,x:'One electron moves from 2s up to the empty 2p box. Now 2s has 1 and 2p has 3: four single electrons.'},
  c5c:{q:'Mixing one s orbital with two p orbitals gives',o:['2 sp orbitals','3 sp² orbitals, with 1 p orbital left over','3 sp³ orbitals','2 sp² orbitals and 1 p orbital'],a:1,x:'Orbitals in = orbitals out: 1 + 2 = 3. The name is the recipe: s¹p² = sp². The third p was not used, so it is left over.'},
  c5d:{q:'Three identical hybrid orbitals push each other apart. Where do they end up?',o:['In a straight line, 180°','In a flat triangle, 120°','At the corners of a tetrahedron, 109.5°','At right angles, 90°'],a:1,x:'Three things spread as far as possible in a flat triangle, 120° apart. That is sp², as in BCl₃.'},
  c5e:{q:'In HCN the carbon has a single bond to H and a triple bond to N. What is the hybridization of the carbon?',o:['sp','sp²','sp³'],a:0,x:'Two regions (the triple bond counts once) → sp → linear, 180°. The two leftover p orbitals make the two π bonds of the triple bond.'},
  c5f:{q:'The nitrogen in NH₃ has 3 bonds and 1 lone pair. What is its hybridization?',o:['sp³','sp²','sp','N is not hybridized'],a:0,x:'3 bonds + 1 lone pair = 4 regions → sp³. The lone pair sits in one of the four sp³ orbitals.'},
  c6:{q:'Using the table method, SF₄ has 6 + 4 = 10 electrons, so 5 pairs. How many lone pairs are on S?',o:['0','1','2','5'],a:1,x:'5 pairs in total, 4 are bonding pairs (one for each F), so 5 − 4 = 1 lone pair.'},
  c6b:{q:'Why is the bond angle in H₂O (104.5°) smaller than in CH₄ (109.5°)?',o:['Lone pairs repel more than bonding pairs and squeeze the bonds together','Water has fewer electron pairs','Oxygen is bigger than carbon','Hydrogen atoms attract each other'],a:0,x:'Both have 4 pairs. Water has 2 lone pairs, which push harder and close the H–O–H angle by about 2.5° each.'},
  c7:{q:'Why is CO₂ non-polar even though each C=O bond is polar?',o:['It is linear and symmetrical, so the two bond dipoles cancel','C and O have the same electronegativity','CO₂ has no electrons','Double bonds cannot be polar'],a:0,x:'Each O pulls equally hard in opposite directions. The pulls cancel, so there is no overall dipole.'},
  c8:{q:'Why does magnesium have a higher melting point than sodium?',o:['Mg gives 2 delocalized electrons per atom and its ion is smaller with a bigger charge, so the attraction is stronger','Mg is a non-metal','Mg has covalent bonds','Sodium ions are smaller'],a:0,x:'More electrons in the sea and a smaller, more charged ion means stronger metallic bonding.'},
  c9:{q:'Graphite conducts electricity but diamond does not. Why?',o:['In graphite each C uses only 3 electrons in bonds; the 4th is delocalized and can move','Graphite contains ions','Diamond has no electrons','Graphite is a metal'],a:0,x:'In diamond all 4 outer electrons are locked in bonds. In graphite one electron per carbon is free to move along the layers.'}
};
const QUIZ=[
  {q:'What is the ground-state electron configuration of carbon?',o:['1s² 2s² 2p²','1s² 2s¹ 2p³','1s² 2p⁴','1s² 2s² 2p⁴'],a:0,x:'Carbon has 6 electrons: 2 in 1s, 2 in 2s, 2 in 2p.'},
  {q:'Why does carbon form four bonds in CH₄ rather than two?',o:['It gains two electrons from hydrogen','One 2s electron is promoted to 2p, then the four orbitals hybridize','Hydrogen atoms share their lone pairs','Carbon expands its octet using d orbitals'],a:1,x:'Promotion gives four single electrons, and hybridization makes four equal sp³ orbitals. Carbon is in period 2 and cannot expand its octet.'},
  {q:'Which hybridization gives a trigonal planar shape with 120° bond angles?',o:['sp','sp²','sp³','none of these'],a:1,x:'Three sp² orbitals spread out flat, 120° apart, as in BCl₃ and around each carbon in ethene.'},
  {q:'The C=C double bond in ethene is made of',o:['two σ bonds','two π bonds','one σ bond and one π bond','one σ bond and two π bonds'],a:2,x:'σ from head-on sp²–sp² overlap. π from sideways overlap of the leftover 2p orbitals.'},
  {q:'Which statement about π bonds is correct?',o:['They are stronger than σ bonds','They form by head-on overlap','Their electrons sit above and below the line between the nuclei','They allow free rotation'],a:2,x:'Sideways p overlap puts the electrons above and below. π bonds are weaker than σ bonds and stop rotation.'},
  {q:'The nitrogen in NH₃ is',o:['sp³, because 3 bonds + 1 lone pair = 4 regions','sp², because it has 3 bonds','sp, because it has 1 lone pair','not hybridized'],a:0,x:'Lone pairs count as regions. 4 regions → sp³. The lone pair squeezes the angle to 107°.'},
  {q:'In CO₂ the carbon atom is',o:['sp, with two π bonds','sp², with one π bond','sp³, with no π bonds','not hybridized'],a:0,x:'Count σ bonds and lone pairs only: 2 regions → sp. The two leftover p orbitals form the two π bonds.'},
  {q:'Why does a C–C single bond rotate freely, but a C=C double bond does not?',o:['Ethene is heavier','Twisting a C=C would break the sideways p overlap of the π bond','Double bonds have lone pairs','The hydrogens block it'],a:1,x:'A σ bond looks the same from every angle. The π bond needs the two p orbitals side by side. Twisting 90° breaks it.'},
  {q:'Ionic bonding is best described as',o:['electrostatic attraction between oppositely charged ions in a lattice','a pair of shared electrons','ions in a sea of electrons','weak attraction between molecules'],a:0,x:'This is the definition from page 60.'},
  {q:'What is the formula of calcium phosphate? (Ca²⁺ and PO₄³⁻)',o:['Ca₃(PO₄)₂','Ca₂(PO₄)₃','CaPO₄','Ca(PO₄)₂'],a:0,x:'3 × (+2) = +6 and 2 × (−3) = −6. Brackets because there are two phosphate ions.'},
  {q:'Sodium chloride conducts electricity',o:['only when melted or dissolved','only when solid','always','never'],a:0,x:'The ions must be free to move. In the solid they are locked in the lattice.'},
  {q:'Which ion is the smallest? (They all have 10 electrons.)',o:['N³⁻','F⁻','Na⁺','Al³⁺'],a:3,x:'Al³⁺ has the most protons (13) pulling the same 10 electrons.'},
  {q:'In a dative covalent bond',o:['both shared electrons come from the same atom','electrons are transferred completely','each atom gives one electron','no electrons are shared'],a:0,x:'The giver has a lone pair. The receiver has an empty space. Drawn as an arrow from the giver.'},
  {q:'Which molecule has an expanded octet?',o:['SF₆','BCl₃','BeCl₂','CH₄'],a:0,x:'S has 12 outer electrons in SF₆. BCl₃ and BeCl₂ have fewer than 8. CH₄ has exactly 8.'},
  {q:'What is the shape of PF₅?',o:['Trigonal bipyramidal','Octahedral','Tetrahedral','Square planar'],a:0,x:'5 bonding pairs, no lone pairs: trigonal bipyramidal, with angles of 120° and 90°.'},
  {q:'Why is the H–O–H angle in water 104.5°, not 109.5°?',o:['The two lone pairs repel more than bonding pairs','Water has only 2 electron pairs','O–H bonds are very long','Water is linear'],a:0,x:'Each lone pair squeezes the angle by about 2.5°: 109.5 − 2 × 2.5 = 104.5°.'},
  {q:'Electronegativity increases across a period because',o:['more protons pull on the same shell, and atoms get smaller','there are more shells','there is more shielding','the atoms get bigger'],a:0,x:'Same shell, more protons: the shared electrons are pulled harder.'},
  {q:'Which molecule is polar?',o:['NH₃','CO₂','CCl₄','BF₃'],a:0,x:'NH₃ is pyramidal with a lone pair, so its bond dipoles do not cancel. The other three are symmetrical.'},
  {q:'Metals are malleable because',o:['layers of identical ions can slide, and the electron sea still holds them','they contain shared pairs','their ions repel when moved','they have weak bonds'],a:0,x:'All the ions are the same, so after sliding nothing changes. The metal bends instead of breaking.'},
  {q:'Iodine has a low melting point because',o:['only weak van der Waals forces hold the I₂ molecules together','the covalent bond inside I₂ is weak','iodine is ionic','iodine has delocalized electrons'],a:0,x:'Melting only separates the molecules. The strong I–I bond inside each molecule does not break.'}
];
const IDEAS=[
  {t:'Electrons live in orbitals',p:'An <button type="button" class="term" data-w="orbital">orbital</button> is like a room for electrons. Each room holds <b>at most 2</b>, spinning opposite ways (↑↓).'},
  {t:'s and p have different shapes',p:'An <button type="button" class="term" data-w="sorb">s orbital</button> is a ball. A <button type="button" class="term" data-w="porb">p orbital</button> is a dumbbell. Shell 2 has one 2s and three 2p, at right angles.'},
  {t:'Box diagrams show the rooms',p:'One box = one orbital. Higher boxes have more energy. Fill from the bottom. In p boxes, one electron each <b>before</b> any pair up.'},
  {t:'A bond needs a single electron',p:'Each atom brings one <button type="button" class="term" data-w="unpaired">unpaired electron</button> to a bond. So: <b>single electrons = bonds</b> the atom can make.'}
];
const STEPNAMES=[['01','Ground state'],['02','Promote'],['03','Mix'],['04','Spread out']];
const ATOMS={
  sp3:{el:'C',name:'Carbon',Z:6,ground:'1s² 2s² 2p²',excited:'1s² 2s¹ 2p³',hybCfg:'1s² (sp³)⁴',nHyb:4,hyb:'sp3',hybTxt:'sp³',molecule:'CH₄',lig:'H',shape:'Tetrahedral',angle:'109.5°',view:'tet',pExtra:'none',
    cap:[['Ground state','Carbon is 1s² 2s² 2p². Only the two 2p electrons are single (the glowing orbitals). On paper carbon could make just two bonds. But methane, CH₄, has four identical C–H bonds.'],
      ['Step 1: promote','A little energy lifts one 2s electron into the empty 2p orbital. Now it is 1s² 2s¹ 2p³ with four single electrons. Making two extra bonds pays back that energy many times over.'],
      ['Step 2: mix','The 2s and all three 2p orbitals blend into four identical sp³ orbitals (one s plus three p). Each has one big lobe, one small lobe and one electron.'],
      ['Step 3: spread out','Four sp³ orbitals repel equally, so they point to the corners of a tetrahedron. Each overlaps head-on with a hydrogen 1s orbital to make a σ bond. Bond angle 109.5°. All four bonds are identical.']]},
  sp2:{el:'B',name:'Boron',Z:5,ground:'1s² 2s² 2p¹',excited:'1s² 2s¹ 2p²',hybCfg:'1s² (sp²)³',nHyb:3,hyb:'sp2',hybTxt:'sp²',molecule:'BCl₃',lig:'Cl',shape:'Trigonal planar',angle:'120°',view:'tilt',pExtra:'empty',
    cap:[['Ground state','Boron is 1s² 2s² 2p¹. Only one single electron, yet BCl₃ has three identical B–Cl bonds.'],
      ['Step 1: promote','One 2s electron is promoted into an empty 2p orbital: 1s² 2s¹ 2p². Now there are three single electrons.'],
      ['Step 2: mix','The 2s and two of the 2p orbitals blend into three sp² orbitals. One 2p orbital is left out. It stays empty and keeps its dumbbell shape (the see-through one).'],
      ['Step 3: spread out','Three sp² orbitals spread out flat, 120° apart, each bonding to a Cl 3p orbital. The empty 2p orbital stands at right angles to the plane. Boron has only six outer electrons, which is why BCl₃ accepts a lone pair from NH₃ (page 68).']]},
  sp:{el:'Be',name:'Beryllium',Z:4,ground:'1s² 2s²',excited:'1s² 2s¹ 2p¹',hybCfg:'1s² (sp)²',nHyb:2,hyb:'sp',hybTxt:'sp',molecule:'BeCl₂',lig:'Cl',shape:'Linear',angle:'180°',view:'lin',pExtra:'empty2',
    cap:[['Ground state','Beryllium is 1s² 2s². No single electrons at all, yet BeCl₂ exists with two Be–Cl bonds.'],
      ['Step 1: promote','One 2s electron is promoted into a 2p orbital: 1s² 2s¹ 2p¹. Two single electrons.'],
      ['Step 2: mix','The 2s and one 2p orbital blend into two sp orbitals. Two 2p orbitals are left out, both empty.'],
      ['Step 3: spread out','Two sp orbitals point in opposite directions, 180° apart. Be ends up with only four outer electrons, so BeCl₂ breaks the octet rule (page 76). Its empty 2p orbitals explain the chain polymer with dative bonds (page 68).']]},
  sp2c:{el:'C',name:'Carbon',Z:6,ground:'1s² 2s² 2p²',excited:'1s² 2s¹ 2p³',hybCfg:'1s² (sp²)³ 2p¹',nHyb:3,hyb:'sp2',hybTxt:'sp²',molecule:'C₂H₄',lig:'H',shape:'Trigonal planar',angle:'120°',view:'tilt',pExtra:'filled',
    cap:[['Ground state','Same carbon as before, 1s² 2s² 2p². In ethene each carbon bonds to two H and one C, with a double bond between the carbons (page 71).'],
      ['Step 1: promote','Promotion works exactly as in methane: 1s² 2s¹ 2p³, four single electrons.'],
      ['Step 2: mix only three','This time the 2s and just two of the 2p orbitals blend, giving three sp² orbitals. The third 2p orbital is not mixed and keeps its electron.'],
      ['Step 3: spread out','Three sp² orbitals make σ bonds at 120°: two to H, one to the other carbon. The leftover 2p orbital stands at right angles to the plane. It overlaps sideways with the 2p on the other carbon to make the π bond (5.7).']]}
};
const MOLS=[
  {f:'CH₄',name:'Methane',c:'C',sig:4,lp:0,pi:0,shape:'Tetrahedral',angle:'109.5°',lig:['H','H','H','H'],why:'Four σ bonds and no lone pairs: four regions, so carbon is sp³.'},
  {f:'NH₃',name:'Ammonia',c:'N',sig:3,lp:1,pi:0,shape:'Trigonal pyramidal',angle:'107°',lig:['H','H','H'],why:'Three bonds plus one lone pair still make four regions, so nitrogen is sp³. The lone pair pushes harder and squeezes the angle to 107°.'},
  {f:'H₂O',name:'Water',c:'O',sig:2,lp:2,pi:0,shape:'Bent',angle:'104.5°',lig:['H','H'],why:'Two bonds plus two lone pairs: four regions, sp³. Two lone pairs squeeze the angle down to 104.5°.'},
  {f:'BF₃',name:'Boron trifluoride',c:'B',sig:3,lp:0,pi:0,shape:'Trigonal planar',angle:'120°',lig:['F','F','F'],why:'Three regions, sp². One empty 2p orbital is left over, so BF₃ can accept a lone pair.'},
  {f:'BeCl₂',name:'Beryllium chloride',c:'Be',sig:2,lp:0,pi:0,shape:'Linear',angle:'180°',lig:['Cl','Cl'],why:'Two regions, sp. Two empty 2p orbitals are left over.'},
  {f:'CO₂',name:'Carbon dioxide',c:'C',sig:2,lp:0,pi:2,shape:'Linear',angle:'180°',lig:['O','O'],why:'Each C=O is one σ plus one π. Count only σ bonds and lone pairs: two regions, so sp. The two leftover 2p orbitals make the two π bonds, one to each O.'},
  {f:'C₂H₄',name:'Ethene (each carbon)',c:'C',sig:3,lp:0,pi:1,shape:'Trigonal planar',angle:'120°',lig:['C','H','H'],why:'Each carbon has two C–H σ bonds and one C–C σ bond. Three regions, sp². The leftover 2p orbital gives the π bond.'},
  {f:'C₂H₂',name:'Ethyne (each carbon)',c:'C',sig:2,lp:0,pi:2,shape:'Linear',angle:'180°',lig:['C','H'],why:'Each carbon has one C–H σ and one C–C σ. Two regions, sp. Two leftover 2p orbitals give two π bonds: a triple bond.'},
  {f:'HCN',name:'Hydrogen cyanide',c:'C',sig:2,lp:0,pi:2,shape:'Linear',angle:'180°',lig:['N','H'],why:'Carbon has one C–H σ and one C–N σ. Two regions, sp. The C≡N triple bond is one σ plus two π.'},
  {f:'NH₄⁺',name:'Ammonium ion',c:'N',sig:4,lp:0,pi:0,shape:'Tetrahedral',angle:'109.5°',lig:['H','H','H','H'],why:'After the dative bond, N has four σ bonds and no lone pair: sp³, a perfect tetrahedron.'}
];
const ORDERS={
  ch4:{label:'CH₄',q:'Explain, using hybridization, why methane is tetrahedral with a bond angle of 109.5°.',steps:[
    'A carbon atom in its ground state is 1s² 2s² 2p², with only 2 unpaired electrons.',
    'One 2s electron is promoted to the empty 2p orbital, giving 1s² 2s¹ 2p³ with 4 unpaired electrons.',
    'The 2s orbital and the three 2p orbitals hybridize to form four identical sp³ orbitals.',
    'The four sp³ orbitals repel each other equally and point to the corners of a tetrahedron.',
    'Each sp³ orbital overlaps head-on with a hydrogen 1s orbital to form a σ bond. Shape tetrahedral, angle 109.5°.']},
  c2h4:{label:'C₂H₄',q:'Explain the bonding in ethene in terms of hybridization, including the σ and π bonds.',steps:[
    'Each carbon in its ground state is 1s² 2s² 2p², with 2 unpaired electrons.',
    'One 2s electron is promoted to 2p, giving 1s² 2s¹ 2p³ with 4 unpaired electrons.',
    'The 2s orbital and two 2p orbitals hybridize into three sp² orbitals. One 2p orbital is left unhybridized.',
    'The three sp² orbitals point to the corners of a triangle, 120° apart, in one plane.',
    'sp² orbitals overlap head-on with H 1s orbitals and with an sp² orbital on the other carbon to form σ bonds.',
    'The unhybridized 2p orbitals on the two carbons overlap sideways, above and below the plane, to form the π bond.']},
  bcl3:{label:'BCl₃',q:'Explain, using hybridization, the shape of boron trichloride.',steps:[
    'Boron in its ground state is 1s² 2s² 2p¹, with only 1 unpaired electron.',
    'One 2s electron is promoted to 2p, giving 1s² 2s¹ 2p² with 3 unpaired electrons.',
    'The 2s orbital and two 2p orbitals hybridize to form three identical sp² orbitals. One empty 2p orbital is left.',
    'The three sp² orbitals repel equally and spread out flat, 120° apart.',
    'Each sp² orbital overlaps head-on with a chlorine orbital to form a σ bond. Shape trigonal planar, 120°.']}
};
const MYTHS=[
  ['"sp³ means 3 orbitals."','The 3 counts the p orbitals that went in. 1 s + 3 p = 4 sp³ orbitals.'],
  ['"A double bond counts as 2 regions."','Any bond, single, double or triple, counts as 1 region. Count σ bonds and lone pairs only.'],
  ['"Lone pairs don\'t count."','They do. NH₃ has 3 bonds + 1 lone pair = 4 regions, so N is sp³.'],
  ['"The π bond sits between the two nuclei."','That is the σ bond. The π bond is above and below the line joining the nuclei.'],
  ['"Hybrid orbitals are just p orbitals."','They are a mix of s and p. A hybrid has one big lobe and one small lobe, so it can point at one atom.'],
  ['"The 1s electrons get promoted too."','Only the outer electrons (2s and 2p) take part. The inner 1s pair stays where it is.'],
  ['"Promotion costs energy, so it makes the molecule less stable."','It costs a little energy, but forming two extra bonds releases much more. Overall the molecule is more stable.'],
  ['"Hybridization only happens in carbon."','Boron (sp² in BCl₃), beryllium (sp in BeCl₂), nitrogen (sp³ in NH₃) and oxygen (sp³ in H₂O) all use it too.']
];
const GROUPS=[
  {g:'1',q:'1+',el:'Li Na K',s:'Na',n:1,act:'lose',ex:'Na → Na⁺ + e⁻',why:'Group 1 atoms have 1 outer electron. Losing 1 is much easier than gaining 7, so they form 1+ ions.'},
  {g:'2',q:'2+',el:'Be Mg Ca',s:'Mg',n:2,act:'lose',ex:'Mg → Mg²⁺ + 2e⁻',why:'Group 2 atoms have 2 outer electrons. Losing 2 is easier than gaining 6, so they form 2+ ions.'},
  {g:'3',q:'3+',el:'Al',s:'Al',n:3,act:'lose',ex:'Al → Al³⁺ + 3e⁻',why:'Group 3 atoms have 3 outer electrons. They lose all 3, so they form 3+ ions.'},
  {g:'4',q:'none',el:'C Si',s:'C',n:4,act:'none',ex:'no ion',why:'Losing or gaining 4 electrons takes too much energy. No element here forms a 4+ or 4− ion. Carbon and silicon bond covalently instead.'},
  {g:'5',q:'3−',el:'N P',s:'N',n:5,act:'gain',ex:'N + 3e⁻ → N³⁻',why:'Group 5 atoms have 5 outer electrons. Gaining 3 is easier than losing 5, so they form 3− ions.'},
  {g:'6',q:'2−',el:'O S',s:'O',n:6,act:'gain',ex:'O + 2e⁻ → O²⁻',why:'Group 6 atoms have 6 outer electrons. Gaining 2 fills the shell, so they form 2− ions.'},
  {g:'7',q:'1−',el:'F Cl Br I',s:'Cl',n:7,act:'gain',ex:'Cl + e⁻ → Cl⁻',why:'Group 7 atoms have 7 outer electrons. Gaining 1 fills the shell, so they form 1− ions.'},
  {g:'0',q:'none',el:'He Ne Ar',s:'Ne',n:8,act:'none',ex:'no ion',why:'Noble gases already have a full outer shell. They do not form ions.'}
];
const CATIONS=[
  {f:'Li',q:1,n:'lithium'},{f:'Na',q:1,n:'sodium'},{f:'K',q:1,n:'potassium'},{f:'Ag',q:1,n:'silver'},{f:'NH₄',q:1,n:'ammonium',poly:true},
  {f:'Mg',q:2,n:'magnesium'},{f:'Ca',q:2,n:'calcium'},{f:'Zn',q:2,n:'zinc'},{f:'Cu',q:2,n:'copper(II)'},{f:'Fe',q:2,n:'iron(II)'},
  {f:'Al',q:3,n:'aluminium'},{f:'Fe',q:3,n:'iron(III)'}
];
const ANIONS=[
  {f:'Cl',q:-1,n:'chloride'},{f:'Br',q:-1,n:'bromide'},{f:'OH',q:-1,n:'hydroxide',poly:true},{f:'NO₃',q:-1,n:'nitrate',poly:true},
  {f:'O',q:-2,n:'oxide'},{f:'S',q:-2,n:'sulfide'},{f:'SO₄',q:-2,n:'sulfate',poly:true},{f:'CO₃',q:-2,n:'carbonate',poly:true},
  {f:'N',q:-3,n:'nitride'},{f:'PO₄',q:-3,n:'phosphate',poly:true}
];
const PC_ATOMS=[['Be',2],['B',3],['Al',3],['C',4],['Si',4],['N',5],['P',5],['O',6],['S',6],['Cl',7],['Br',7],['I',7],['Xe',8]];
const PC_PRESETS=[
  {f:'BeCl₂',c:'Be',n:2,l:'Cl',q:0},{f:'BCl₃',c:'B',n:3,l:'Cl',q:0},{f:'CH₄',c:'C',n:4,l:'H',q:0},{f:'NH₃',c:'N',n:3,l:'H',q:0},{f:'H₂O',c:'O',n:2,l:'H',q:0},
  {f:'NH₄⁺',c:'N',n:4,l:'H',q:1},{f:'H₃O⁺',c:'O',n:3,l:'H',q:1},{f:'SiF₄',c:'Si',n:4,l:'F',q:0},{f:'PF₅',c:'P',n:5,l:'F',q:0},{f:'SF₆',c:'S',n:6,l:'F',q:0},
  {f:'SF₄',c:'S',n:4,l:'F',q:0},{f:'ClF₃',c:'Cl',n:3,l:'F',q:0},{f:'I₃⁻',c:'I',n:2,l:'I',q:-1},{f:'IF₄⁺',c:'I',n:4,l:'F',q:1},{f:'XeF₄',c:'Xe',n:4,l:'F',q:0},{f:'BF₄⁻',c:'B',n:4,l:'F',q:-1}
];
const SHAPES={
  '2-0':{name:'Linear',angle:'180°',note:''},
  '3-0':{name:'Trigonal planar',angle:'120°',note:''},
  '2-1':{name:'Bent',angle:'about 118°',note:'One lone pair squeezes the 120° angle a little.'},
  '4-0':{name:'Tetrahedral',angle:'109.5°',note:''},
  '3-1':{name:'Trigonal pyramidal',angle:'107°',note:'The lone pair squeezes the angle by about 2.5°.'},
  '2-2':{name:'Bent',angle:'104.5°',note:'Two lone pairs squeeze the angle by about 5°.'},
  '1-3':{name:'Linear (only two atoms)',angle:'none',note:'With only two atoms, the shape is always a straight line.'},
  '1-2':{name:'Linear (only two atoms)',angle:'none',note:'With only two atoms, the shape is always a straight line.'},
  '1-1':{name:'Linear (only two atoms)',angle:'none',note:''},
  '1-0':{name:'Linear (only two atoms)',angle:'none',note:''},
  '5-0':{name:'Trigonal bipyramidal',angle:'120° and 90°',note:'Three bonds in a flat triangle, one above and one below.'},
  '4-1':{name:'Distorted tetrahedron (see-saw)',angle:'about 119° and 89°',note:'The lone pair takes a place in the triangle (page 80).'},
  '3-2':{name:'T-shaped',angle:'about 89°',note:'Both lone pairs sit in the triangle (page 80).'},
  '2-3':{name:'Linear',angle:'180°',note:'Three lone pairs spread evenly round the middle, so they cancel out (page 80).'},
  '6-0':{name:'Octahedral',angle:'90°',note:''},
  '5-1':{name:'Square pyramidal',angle:'about 89°',note:'Beyond AS, but the method still works.'},
  '4-2':{name:'Square planar',angle:'90°',note:'The two lone pairs sit opposite each other.'}
};
const SUMMARY=[
  {n:'Linear',bp:2,lp:0,ang:'180°',ex:'CO₂, CS₂, HCN, BeF₂',ico:{n:2,ligs:['Cl','Cl'],center:'Be'}},
  {n:'Trigonal planar',bp:3,lp:0,ang:'120°',ex:'BF₃, AlCl₃, SO₃, NO₃⁻, CO₃²⁻',ico:{n:3,ligs:['Cl','Cl','Cl'],center:'B'}},
  {n:'Tetrahedral',bp:4,lp:0,ang:'109.5°',ex:'SiCl₄, SO₄²⁻, ClO₄⁻, NH₄⁺',ico:{n:4,ligs:['H','H','H','H'],center:'C'}},
  {n:'Trigonal pyramidal',bp:3,lp:1,ang:'107°',ex:'NCl₃, PF₃, ClO₃⁻, H₃O⁺',ico:{n:4,lp:1,ligs:['H','H','H'],center:'N'}},
  {n:'Bent',bp:2,lp:2,ang:'104.5°',ex:'OCl₂, H₂S, OF₂, SCl₂',ico:{n:4,lp:2,ligs:['H','H'],center:'O'}},
  {n:'Trigonal bipyramidal',bp:5,lp:0,ang:'120° and 90°',ex:'PCl₅',ico:{n:5,ligs:['F','F','F','F','F'],center:'P'}},
  {n:'Octahedral',bp:6,lp:0,ang:'90°',ex:'SF₆',ico:{n:6,ligs:['F','F','F','F','F','F'],center:'S'}}
];
const EN=[
  [['H',2.1],null,null,null,null,null,null],
  [['Li',1.0],['Be',1.5],['B',2.0],['C',2.5],['N',3.0],['O',3.5],['F',4.0]],
  [['Na',0.9],['Mg',1.2],['Al',1.5],['Si',1.8],['P',2.1],['S',2.5],['Cl',3.0]],
  [['K',0.8],['Ca',1.0],['Ga',1.6],['Ge',1.8],['As',2.0],['Se',2.4],['Br',2.8]],
  [['Rb',0.7],['Sr',1.0],['In',1.7],['Sn',1.8],['Sb',1.9],['Te',2.1],['I',2.5]]
];
const TUGS=[['H','H'],['C','H'],['H','Cl'],['O','H'],['H','F'],['C','Cl'],['N','H'],['Na','Cl']];
const STR_INFO={
  nacl:{t:'Sodium chloride',k:'Ionic',pts:['Na⁺ and Cl⁻ ions alternate in a cube pattern.','Each ion is surrounded by 6 ions of the opposite charge.','High melting point (801 °C): lots of strong attractions to break.','Conducts only when melted or dissolved.']},
  metal:{t:'Magnesium',k:'Metallic',pts:['Mg²⁺ ions packed as closely as possible, layer on layer.','A sea of delocalized electrons (the moving dots) holds them together.','Conducts electricity and heat. Malleable, ductile and shiny.']},
  iodine:{t:'Iodine',k:'Molecular',pts:['I₂ molecules arranged in a regular pattern.','A strong covalent bond holds the two atoms in each molecule.','Only weak van der Waals forces between molecules, so it melts at just 114 °C.','Does not conduct: no charged particles. Does not dissolve well in water.']},
  diamond:{t:'Diamond',k:'Macromolecular',pts:['Each carbon is bonded to 4 others in a tetrahedral pattern, like methane (sp³).','Very hard and a very high melting point: millions of strong covalent bonds.','Does not conduct: all 4 outer electrons are used in bonds.']},
  graphite:{t:'Graphite',k:'Macromolecular',pts:['Flat layers of hexagons. Each carbon bonds to 3 others at 120°, like ethene (sp²).','The 4th electron of each carbon is delocalized (the moving dots), so graphite conducts along the layers.','Weak forces between layers let them slide, so graphite is soft and slippery.','Very high melting point: strong covalent bonds within each layer.']}
};
