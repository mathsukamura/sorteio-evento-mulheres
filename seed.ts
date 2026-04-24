import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'rifa.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS participantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_ingresso TEXT,
    participante TEXT NOT NULL,
    comprador TEXT,
    email TEXT,
    opcao_ingresso TEXT,
    situacao TEXT DEFAULT 'Confirmado',
    codigo_desconto TEXT,
    data_venda TEXT,
    hora_venda TEXT,
    data_cancelamento TEXT,
    data_validacao TEXT,
    whatsapp TEXT,
    legendario TEXT,
    cidade TEXT,
    estado TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS sorteios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    participante_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participante_id) REFERENCES participantes(id)
  );
`);

const data = `1469729	Deysianne Teixeira de Lima	Paola Mota	teixeiradeysianne780@gmail.com	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	16:55:31			(99) 98138-5479		Imperatriz	MA
1469705	Werbenia Soares	Vanessa Carvalho	agatha_nessa@hotmail.com	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	16:27:47			(94) 98404-3177		Parauapebas	PA
1469704	Vanessa Carvalho	Vanessa Carvalho	agatha_nessa@hotmail.com	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	16:27:47			(99) 98200-7844		Imperatriz	MA
1469694	Victoria Frota	Gabriela Andrade	ysabella_andrade@hotmail.com	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	16:10:12			(62) 98152-9304		Imperatriz	MA
1469691	Izabela Vieira Silva	Izabela Vieira	izabelavieirasilva57@gmail.com	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	15:58:19			(99) 99131-8295		Imperatriz	MA
1469575	Dandara Rafaela Alves da Silva Nascimento	Dandara Rafaela	dandara.rafaela72@gmail.com	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	13:30:47			(99) 99104-4424		Imperatriz	MA
1469560	Veralucia Maciel Heringer	Veralucia Maciel	veraluciamacielheringer@gmail.com	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	13:24:14			(99) 99128-8820		Imperatriz	MA
1469551	Ana Célia Sousa Mota	Isa Rágilla	isaragillamotasousa@gmail.com	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	13:14:43			(99) 99214-4249		Imperatriz	MA
1469532	Keiliane Silva Cruz Queiroz	Keiliane Cruz	keilicruz@icloud.com	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	12:58:18			(99) 99646-8917		Imperatriz	MA
1469500	Amanda Martins	Amanda Martins 	amanda201567@outlook.com.br	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	12:20:16			(63) 99227-0460		Augustinópolis	TO
1469499	Julyana Moura	Amanda Martins 	amanda201567@outlook.com.br	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	12:20:16			(63) 99261-4833		Augustinópolis	TO
1469472	Bruna Pessoa Sousa Cavalcante	Bruna  Cavalcante 	brunna.pessoa@hotmail.com	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	11:49:10			(99) 99118-0848		Imperatriz	MA
1469468	Marisa Rafael	Joana Maria	joanasantoshelena1920@gmail.com	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	11:45:40			(99) 99106-5695		Açailândia	MA
1469467	Joana Thomazini	Joana Maria	joanasantoshelena1920@gmail.com	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	11:45:40			(98) 99154-5759		Bom Jesus das Selvas	MA
1469459	Mayara Carneiro Costa do Ó	Mayara Carneiro Costa do Ó	mayarajmcontabil@gmail.com	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	11:32:54			(99) 98437-0042		Imperatriz	MA
1469444	Jarlleny Carneiro	Jarlleny Holanda	jarllenyholanda@hotmail.com	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	11:16:20			(61) 98436-4984		Imperatriz	MA
1469436	Vilany Carneiro Costa	Vilany Carneiro	vilanyccosta1962@gmail.com	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	11:10:00			(99) 98105-4286		Imperatriz	MA
1469430	Eliana Borin	Evelise Borin	draeveliseborin@gmail.com	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	10:54:38			(99) 98109-8740		Imperatriz	MA
1469429	Evelise Borin	Evelise Borin	draeveliseborin@gmail.com	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	10:54:38			(99) 99102-5474		Imperatriz	MA
1469394	Francisca Caetano	Francisca Caetano	franciscacaetanocunha@gmail.com	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	10:23:02			(99) 98418-1221		Imperatriz	MA
1469371	Bruna Alcântara	Bruna Letícia	brunaalcantaral.21@gmail.com	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	10:00:39			(99) 98537-1364		Imperatriz	MA
1469363	Nathassia Hellen Viana Silva Sales	Nathassia Hellen	nathassia.hvs@outlook.com	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	09:56:29			(99) 98409-5795		Imperatriz	MA
1469329	Tamires Diniz	Kerolana Tamires	tamiires_diniz@outlook.com	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	09:29:01			(99) 99117-6288		Imperatriz	MA
1469325	Bruna Pessoa de Sousa Cavalcante	Bruna  Cavalcante 	brunna.pessoa@hotmail.com	MULHERES - INDIVIDUAL	Cancelado		24/04/2026	09:20:55	24/04/2026 09:20:55		(99) 99118-0848		Imperatriz	MA
1469314	Adriana Brito Guimarães	Patrícia Almeida	designpatriciaalmeida@gmail.com	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	08:52:23			(95) 99129-3645		Imperatriz	MA
1469312	Sirlene Cardoso da Silva Barbosa	Michelle Silva	sirlenecardoso0111@gmail.com	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	08:49:33			(62) 98211-6044		Imperatriz	MA
1469300	Adriana Meneses Vieira Silva	Roberta Alencar	robertaalencarthome@gmail.com	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	08:27:53			(99) 98123-3203		Imperatriz	MA
1469299	Roberta Alencar Thomé	Roberta Alencar	robertaalencarthome@gmail.com	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	08:27:53			(99) 99136-0478		Imperatriz	MA
1469286	Thais Oliveira	Thais Oliveira	thaisadvogada8@gmail.com	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	08:07:39			(99) 98276-9467		Imperatriz	MA
1469285	Gabriela dos Santos	Gabriela Sousa	gabrielasousadk2005@gmail.com	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	08:04:00			(99) 99179-9366		Imperatriz	MA
1469284	Elanne Gomes	Elanne Gomes	elannecris@hotmail.com	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	08:01:17			(99) 98128-2201		Imperatriz	MA
1469281	Gabriela Sousa dos Santos	Gabriela Sousa	gabrielasousadk2005@gmail.com	MULHERES - INDIVIDUAL	Pendente		24/04/2026	07:55:39			(99) 99179-9366		Imperatriz	MA
1469280	Clediana Oliveira	Clediana Oliveira 	cleude.oliveira1@gmail.com	MULHERES - INDIVIDUAL	Confirmado		24/04/2026	07:51:39			(99) 98164-0119		Imperatriz	MA
1469237	Maria de Fátima Fátima	Leda Maria	ledamaria2024@icloud.com	MULHERES - INDIVIDUAL	Confirmado		23/04/2026	23:55:50			(99) 99168-9511		Imperatriz	MA
1469236	Leda Maria Soares Pereira Soares	Leda Maria	ledamaria2024@icloud.com	MULHERES - INDIVIDUAL	Confirmado		23/04/2026	23:55:50			(99) 99168-3125		Imperatriz	MA
1469211	Maria de Loide Alvino da Silva	Keyla Moreira	keylamoreirausa@gmail.com	MULHERES - INDIVIDUAL	Confirmado		23/04/2026	23:34:46			(55) 99991-6821		Imperatriz	MA
1469170	Joelma Campolina	Rodrigo  Campolina 	rjcampolina@hotmail.com	MULHERES - INDIVIDUAL	Confirmado		23/04/2026	22:41:39			(99) 98113-0396		Imperatriz	MA
1469160	Eliana Borin	Evelise Borin	draeveliseborin@gmail.com	MULHERES - INDIVIDUAL	Pendente		23/04/2026	22:25:45			(99) 98109-8740		Imperatriz	MA
1469159	Evelise Borin	Evelise Borin	draeveliseborin@gmail.com	MULHERES - INDIVIDUAL	Pendente		23/04/2026	22:25:45			(99) 99102-5474		Imperatriz	MA
1469045	Jaíres Fernandes da Silva Lemos	Jaíres Fernandes	jaireslemos1906@gmail.com	MULHERES - INDIVIDUAL	Confirmado		23/04/2026	21:08:18			(99) 99167-9584		Imperatriz	MA
1469039	Débora Rodrigues da Costa	Grasielly Cordeiro 	graszy@hotmail.com	Ingresso2	Confirmado		23/04/2026	21:07:09
1469037	Antônia Aldenate Lacerda	Izabela Lacerda	izabelalacerda521@gmail.com	MULHERES - INDIVIDUAL	Confirmado		23/04/2026	20:57:04			(99) 98407-2771		Imperatriz	MA
1469032	Euzebia de Jesus Santos Costa	Ivo Duan  Mercier Falcão 	ivoduan.mf@hotmail.com	MULHERES - INDIVIDUAL	Confirmado		23/04/2026	20:50:34			(99) 98414-6496		Imperatriz	MA
1469024	Hellen Tarsany Valero	Ronny Franco	francoanakaroline@gmail.com	MULHERES - INDIVIDUAL	Confirmado		23/04/2026	20:41:30			(99) 99184-3820		Imperatriz	MA
1468956	Fabíola Sâmia Carvalho Daumas	Fabíola Sâmia	fabioladeoliveira10@hotmail.com	MULHERES - INDIVIDUAL	Confirmado		23/04/2026	19:36:32			(99) 99100-0378		Imperatriz	MA
1468947	Tássia Atta	Tassia Atta	tassiafsmaia@gmail.com	MULHERES - INDIVIDUAL	Confirmado		23/04/2026	19:26:24			(99) 98461-9191		Imperatriz	MA
1468925	Kamila Oliveira	Bruno Oliveira 	kamila.porfirioadv@gmail.com	MULHERES - INDIVIDUAL	Confirmado		23/04/2026	19:05:42			(99) 98130-3668		Imperatriz	MA
1468911	Julliano de Andrade Nascimento Farias de Andrade Nascimento Farias	Raquel Gonçalves	raquelandradepazadv@hotmail.com	MULHERES - INDIVIDUAL	Confirmado		23/04/2026	18:59:56			(98) 98302-3756		Barreirinhas	MA
1468910	Raquel Goçalves de Andrade Paz Gonçalves de Andrade Paz	Raquel Gonçalves	raquelandradepazadv@hotmail.com	MULHERES - INDIVIDUAL	Confirmado		23/04/2026	18:59:56			(99) 98141-3464		Imperatriz	MA
1468908	Gildeane Barroso	Gildeane Barroso	gildeanesb@gmail.com	MULHERES - INDIVIDUAL	Confirmado		23/04/2026	18:53:30			(99) 99218-7311		Imperatriz	MA
1468904	Sabrina Leão	Maria Dores 	sahleao1195@gmail.com	MULHERES - INDIVIDUAL	Confirmado		23/04/2026	18:43:19			(11) 95678-4894		São Paulo	SP
1468900	Ana Karoline Franco	Ronny Franco	francoanakaroline@gmail.com	MULHERES - INDIVIDUAL	Confirmado		23/04/2026	18:34:55			(99) 99112-5025		Açailândia	MA
1468895	Ruth Maia	Ruth Sousa	ruthmaia071@gmail.com	MULHERES - INDIVIDUAL	Confirmado		23/04/2026	18:26:21			(63) 99991-8790		Imperatriz	MA
1468893	Nathália Costa Ferraz	Nathalia C Ferraz	nathaliacferraz@gmail.com	MULHERES - INDIVIDUAL	Confirmado		23/04/2026	18:26:37			(99) 98405-3638		Imperatriz	MA
1468875	Vanessa Lima Silva	Vanessa Lima	vanessapapany10@gmail.com	MULHERES - INDIVIDUAL	Confirmado		23/04/2026	17:56:47			(99) 98447-5377		Imperatriz	MA
1468870	Luz Feuerstein	Luzilandia Oliveira	lucoelho379@gmail.com	MULHERES - INDIVIDUAL	Confirmado		23/04/2026	17:51:13			(99) 98241-7074		Imperatriz	MA
1468838	Francina Matos	Antônio Máximo  dos Santos 	etiene.leite@hotmail.com	MULHERES - INDIVIDUAL	Confirmado		23/04/2026	17:22:30			(99) 99122-4100		Imperatriz	MA
1468837	Etiane Franco	Antônio Máximo  dos Santos 	etiene.leite@hotmail.com	MULHERES - INDIVIDUAL	Confirmado		23/04/2026	17:22:30			(99) 99122-4100		Imperatriz	MA
1468826	Larissa Santiago Lopes	Larissa Cristina	larissacristty@hotmail.com	MULHERES - INDIVIDUAL	Confirmado		23/04/2026	17:09:17			(99) 99198-0342		Imperatriz	MA
1468818	Dayane Pereira Souza Cruz	Dayane Pereira	day.souzaenzo@gmail.com	Ingresso2	Confirmado		23/04/2026	16:56:01
1468747	Vânia da Silva Santos	Vania da Silva Santos	vaniaeng27@gmail.com	MULHERES - INDIVIDUAL	Confirmado		23/04/2026	15:12:07			(98) 98223-8759		Imperatriz	MA
1468738	Ana Vitoria Barroso	Ana Vitoria	avitoria766@gmail.com	MULHERES - INDIVIDUAL	Confirmado		23/04/2026	15:04:19			(99) 98126-2838		Imperatriz	MA`;

const insert = db.prepare(`
  INSERT INTO participantes (id_ingresso, participante, comprador, email, opcao_ingresso, situacao, codigo_desconto, data_venda, hora_venda, data_cancelamento, data_validacao, whatsapp, legendario, cidade, estado)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const lines = data.split('\n');
let count = 0;

const insertAll = db.transaction(() => {
  for (const line of lines) {
    const cols = line.split('\t');
    if (cols.length < 5) continue;
    insert.run(
      cols[0]?.trim() || null,
      cols[1]?.trim() || '',
      cols[2]?.trim() || null,
      cols[3]?.trim() || null,
      cols[4]?.trim() || null,
      cols[5]?.trim() || 'Confirmado',
      cols[6]?.trim() || null,
      cols[7]?.trim() || null,
      cols[8]?.trim() || null,
      cols[9]?.trim() || null,
      cols[10]?.trim() || null,
      cols[11]?.trim() || null,
      cols[12]?.trim() || null,
      cols[13]?.trim() || null,
      cols[14]?.trim() || null,
    );
    count++;
  }
});

insertAll();
console.log(`Seed completo! ${count} participantes inseridas.`);
db.close();
