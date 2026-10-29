// LINE特典の本棚の差し替え設定。リンクや合言葉が変わったら、ここだけ書き換える。
// 第一の棚は合言葉「ばいこう」でひらく（公式LINEの3通目以降で伝える。合言葉＋公開日時の両方で解放）。
// always:true は合言葉に関係なく、最初からひらいている（1対1のLINE相談は常時受け付けのため）。
// url を空にすると「準備中」と表示される（参加者限定の特典は、完成したら url を入れる）。
window.SHELF = {
  line: [
    { title: 'スマホで梅光の1日体験', note: '登校から放課後まで、生徒の目線で。', url: 'https://baikogakuin.github.io/baiko-immersive-lp/', releaseAt: '2026-10-29T20:00', kind: '体験' },
    { title: '50分で全部わかる学校説明動画', note: '下関まで来なくても大丈夫。家族で、好きな時間に。', url: 'https://baikogakuin.github.io/baiko-video/', releaseAt: '2026-10-31T20:00', kind: '動画' },
    { title: '在校生のホンネ集', note: '先生の前では言えない「ぶっちゃけ」を1冊に。', url: 'https://baikogakuin.github.io/baiko-honne/', releaseAt: '2026-11-02T20:00', kind: '読み物' },
    { title: '梅光で生徒が“化ける”理由', note: '入学してから何が変わるのか、13枚のスライドで。', url: 'https://baikogakuin.github.io/baiko-bakeru/', releaseAt: '2026-11-05T20:00', kind: 'スライド' },
    { title: '1対1のLINE相談', note: '人には聞きにくいことも、トークでこっそり。返信は平日8:30〜17:20、3営業日以内。', always: true, url: 'https://lin.ee/xZlPS00', kind: '相談', cta: 'トークで相談する' }
  ],
  guest: [
    { title: '生徒が英語で案内する行事ツアー', note: '字幕つき。英語が苦手でも楽しめる。', url: '', kind: '動画' },
    { title: '在校生ぶっちゃけQ&A動画', note: '在校生が、聞かれたことに本音で答える。', url: '', kind: '動画' },
    { title: '50万円を任された高校生の話', note: '生徒だけで集客を動かした本人たちのインタビュー。', url: '', kind: '読み物' },
    { title: '説明会まるごと見逃し録画', note: '聞き逃した所を、あとから家族で。', url: '', kind: '動画' }
  ],
  // 合言葉の照合用（'baiko-shelf:' + 合言葉 のSHA-256）。
  // lineKeys：第一の棚。ばいこう／バイコウ／梅光
  lineKeys: [
    '6810ec6dba35175daffc663251bfda05e2cf5a8aac0792dcf2d1a52294957c46',
    '95a3bd903d7de19cd44167bad0eb178c45b3f4489aae39f605a69114d2edc6fb',
    '082f6be0eb36267108ef8d956dab92ffbed86966185a5eff361ad126a30f20d4'
  ],
  // guestKeys：第二の棚（説明会の参加者限定）。しおかぜ／潮風／シオカゼ
  guestKeys: [
    '52beabe13cd7c9fe4be3c0f7e7dfab88278f040ab96033999999f91673c81449',
    '6438c76d7f270d5adfbb874fa2b5b5686e13c365a31f35895a815061e2f35b0f',
    'c5eb42a6f46aaf75c7561ebc7292edd51f7fb76e99578b9ecfbb9b424d8b5e83'
  ],
  // 説明会の案内。online の締切を過ぎたら visit に切り替わる。
  next: {
    online: { until: '2026-11-11T20:00', title: '参加すると、第二の棚の4つがひらきます', label: '11/11（水）20:00〜\nオンライン学校説明会に申し込む', note: '※本説明会は2027年度入試の受験料免除の対象外です。', url: 'https://seed.software/public/baiko/322f7735d1' },
    visit: { title: '次は、学校で会いましょう', label: '11/28（土）入試説明会\n（中学生の部）に申し込む', note: '在校生の話、入試のポイント解説、個別相談があります。', url: 'https://seed.software/public/baiko/4e6a85a05a' }
  },
  lineUrl: 'https://lin.ee/xZlPS00'
};
