// 特典の書架の差し替え設定。リンクや日付が変わったら、ここだけ書き換える。
// opens：この日時（日本時間）を過ぎたら、ひらいて見られる。公式LINEの一斉配信と同じ日時にそろえてある。
// always:true は日付に関係なく、最初からひらいている（1対1のLINE相談は常時受け付けのため）。
// url を空にすると「準備中」と表示される（参加者限定の特典は、完成したら url を入れる）。
window.SHELF = {
  line: [
    { title: 'スマホで梅光の1日体験', note: '登校から放課後まで、生徒の目線で。', opens: '2026-10-29T20:00', url: 'https://baikogakuin.github.io/baiko-immersive-lp/', kind: '体験' },
    { title: '50分で全部わかる学校説明動画', note: '下関まで来なくても大丈夫。家族で、好きな時間に。', opens: '2026-10-31T20:00', url: 'https://baikogakuin.github.io/baiko-video/', kind: '動画' },
    { title: '在校生のホンネ集', note: '先生の前では言えない「ぶっちゃけ」を1冊に。', opens: '2026-11-02T20:00', url: 'https://baikogakuin.github.io/baiko-honne/', kind: '読み物' },
    { title: '梅光で生徒が“化ける”理由', note: '入学してから何が変わるのか、13枚のスライドで。', opens: '2026-11-05T20:00', url: 'https://baikogakuin.github.io/baiko-bakeru/', kind: 'スライド' },
    { title: '1対1のLINE相談', note: '人には聞きにくいことも、トークでこっそり。返信は平日8:30〜17:20、3営業日以内。', always: true, opens: '2026-11-08T20:00', url: 'https://lin.ee/xZlPS00', kind: '相談', cta: 'トークで相談する' }
  ],
  guest: [
    { title: '生徒が英語で案内する行事ツアー', note: '字幕つき。英語が苦手でも楽しめる。', url: '', kind: '動画' },
    { title: '在校生ぶっちゃけQ&A動画', note: '在校生が、聞かれたことに本音で答える。', url: '', kind: '動画' },
    { title: '50万円を任された高校生の話', note: '生徒だけで集客を動かした本人たちのインタビュー。', url: '', kind: '読み物' },
    { title: '説明会まるごと見逃し録画', note: '聞き逃した所を、あとから家族で。', url: '', kind: '動画' }
  ],
  // 合言葉の照合用（'baiko-shelf:' + 合言葉 のSHA-256）。しおかぜ／潮風／シオカゼ
  keys: [
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
