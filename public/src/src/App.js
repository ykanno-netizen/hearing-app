import { useState } from "react";

// ── Formspree エンドポイント（STEP2で取得したIDに差し替えてください） ──
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xdaweoda";

const SECTIONS = [
  {
    id: 1,
    title: "お客様の状況把握",
    desc: "あなたの会社・お立場について教えてください。より良いサイト制作のためにお聞きします。",
    fields: [
      { id: "role", label: "あなたのお役職・役割", type: "text", placeholder: "例：社長、店長、現場責任者など" },
      { id: "decision_maker", label: "最終的な決裁者はどなたですか？", type: "radio", options: ["オーナー", "会長", "社長", "役員会", "社員や知人の意見を重視"] },
      { id: "decision_method", label: "決裁の方法を教えてください", type: "radio", options: ["決裁者単独判断", "役員会決裁（月1回）", "稟議プロセスあり"] },
      { id: "services_used", label: "現在ご利用中のサービスをお選びください", type: "checkbox", options: ["採用コンサルティング", "ロカオプ（マーケティングツール導入）", "LINE運用支援"] },
    ]
  },
  {
    id: 2,
    title: "今回の目的と優先順位（戦略）",
    desc: "サイトを作る目的や、特に力を入れたいことを教えてください。",
    fields: [
      { id: "ratio_recruit", label: "採用活動と集客の重視割合", type: "percent", pair: "ratio_attract", pairLabel: "集客強化" },
      { id: "main_services", label: "メインで紹介したいサービスを選んでください（複数可）", type: "checkbox", options: ["車検・点検", "整備・修理", "板金・塗装", "保険サービス", "中古車販売", "新車販売", "カーリース", "車買取", "洗車 / コーティング / ラッピング", "チューニング / カスタマイズ"] },
      { id: "contact_methods", label: "お問い合わせ・応募の受付窓口はどれですか？（複数可）", type: "checkbox", options: ["LINE", "電話", "問い合わせフォーム", "メール", "予約リンク", "営業カレンダー"] },
    ]
  },
  {
    id: 3,
    title: "魅力を伝えたい設備・環境・シーン（撮影）",
    desc: "お店・会社の魅力をサイトで伝えるために、掲載したい設備や撮影したいシーンを選んでください。",
    fields: [
      { id: "facilities", label: "サイトに掲載したい設備を選んでください（複数可）", type: "checkbox", options: ["リフト（乗用車/トラック）", "判定・検査機器", "工具・工具箱", "板金作業エリア", "板金機材（フレーム修正機など）", "塗装ブース・調色室", "洗車 / ラッピング / コーティング場所", "OBD検査 / エーミング検査機器", "商談スペース", "キッズスペース", "ドリンクコーナー", "きれいなトイレ（おむつ替えシート）", "納車専用コーナー"] },
      { id: "scenes", label: "撮影しておきたいシーンを選んでください（複数可）", type: "checkbox", options: ["車検・点検作業", "板金・塗装作業", "整備の実作業", "車検 / OBD / エーミング等 検査シーン", "接客・商談の様子", "納車式の風景", "買い取り査定の様子", "お店のイベント", "社員集合写真"] },
      { id: "specific_staff", label: "特定の社員を撮影したい場合はお名前をご記入ください", type: "text", placeholder: "例：営業担当の田中さん" },
    ]
  },
  {
    id: 4,
    title: "制作上の「心の不安」確認",
    desc: "サイト制作に関して、不安なことや分からないことを正直に教えてください。一緒に解決します！",
    fields: [
      { id: "past_site", label: "過去にサイト制作のご経験は？", type: "radio", options: ["ある", "はじめて"] },
      { id: "process_understanding", label: "制作の進め方について", type: "radio", options: ["分かる", "分からない", "不安"] },
      { id: "check_point", label: "確認ポイントについて", type: "radio", options: ["分かる", "分からない", "不安"] },
      { id: "knowledge", label: "サイトの良し悪しの判断", type: "radio", options: ["できる", "できない", "不安"] },
      { id: "own_opinion", label: "デザインや内容へのご自身の意見", type: "radio", options: ["ある", "まかせたい", "相談したい"] },
      { id: "mvv", label: "MVVなどの企業メッセージ", type: "radio", options: ["ある", "これからつくる", "相談したい"] },
      { id: "text_writing", label: "サイトの文章（テキスト）", type: "radio", options: ["自社で書く", "まかせたい"] },
      { id: "photos", label: "写真・画像素材", type: "radio", options: ["ある", "ない", "プロにまかせる"] },
      { id: "site_operation", label: "サイト運用（ニュース更新など）", type: "radio", options: ["自分でやりたい", "できない", "まかせたい"] },
      { id: "site_analysis", label: "サイト分析・アクセス解析", type: "radio", options: ["する", "しない", "勉強したい"] },
      { id: "anxiety_work", label: "作業に対して不安なことはありますか？（複数可）", type: "checkbox", options: ["写真撮影（何を準備すればいいか不安）", "画面での確認作業（見方がわからない・面倒）", "ヒアリングシートの記入（文章を書くのが苦手）"] },
      { id: "confirm_time", label: "内容確認のお時間は取れそうですか？", type: "radio", options: ["ある", "時間がかかりそう", "相談したい"] },
      { id: "anxiety_communication", label: "やり取りに対して不安なことはありますか？（複数可）", type: "checkbox", options: ["Zoom（パソコン操作が不安）", "自分の思いを「言葉」にするのが苦手", "専門用語がわからない"] },
      { id: "contact_preference", label: "ご希望の連絡手段", type: "radio", options: ["LINEがいい", "電話がいい", "どちらでも"] },
      { id: "anxiety_other", label: "その他、気になっていることはありますか？（複数可）", type: "checkbox", options: ["納期（いつまでにできるか心配）", "追加料金（知らないうちにお金が増えないか）", "ドメイン管理（自社のドメイン情報がわからない）"] },
      { id: "memo", label: "その他・自由にご記入ください", type: "textarea", placeholder: "ご質問・ご要望・気になることなど何でもどうぞ" },
    ]
  }
];

const ACCENT="#e53e3e", DARK="#1a1a2e", CARD="#16213e", BORDER="#2a2a4a", TEXT="#e2e8f0", MUTED="#94a3b8";
const inp = { width:"100%", background:DARK, border:`1px solid ${BORDER}`, borderRadius:8, color:TEXT, padding:"9px 12px", fontSize:13, boxSizing:"border-box" };

function CheckboxGroup({ options, value=[], onChange }) {
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
      {options.map(opt => {
        const checked = value.includes(opt);
        return (
          <div key={opt} onClick={() => onChange(checked ? value.filter(v=>v!==opt) : [...value,opt])}
            style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer",
              background:checked?"#7f1d1d":BORDER, border:`1.5px solid ${checked?ACCENT:BORDER}`,
              borderRadius:8, padding:"6px 12px", fontSize:13, color:checked?"#fca5a5":MUTED,
              transition:"all .15s", userSelect:"none" }}>
            <span style={{ width:16, height:16, borderRadius:4, border:`2px solid ${checked?ACCENT:"#475569"}`,
              background:checked?ACCENT:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              {checked && <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>}
            </span>
            {opt}
          </div>
        );
      })}
    </div>
  );
}

function RadioGroup({ options, value, onChange }) {
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
      {options.map(opt => {
        const sel = value===opt;
        return (
          <div key={opt} onClick={() => onChange(opt)}
            style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer",
              background:sel?"#7f1d1d":BORDER, border:`1.5px solid ${sel?ACCENT:BORDER}`,
              borderRadius:20, padding:"6px 16px", fontSize:13, color:sel?"#fca5a5":MUTED,
              transition:"all .15s", userSelect:"none" }}>
            <span style={{ width:14, height:14, borderRadius:"50%", border:`2px solid ${sel?ACCENT:"#475569"}`,
              background:sel?ACCENT:"transparent", flexShrink:0 }} />
            {opt}
          </div>
        );
      })}
    </div>
  );
}

function PercentField({ value, onChange }) {
  const v = parseInt(value)||50;
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:13, color:MUTED }}>
        <span>🏢 採用活動：<b style={{ color:ACCENT, fontSize:16 }}>{v}%</b></span>
        <span>📣 集客強化：<b style={{ color:"#60a5fa", fontSize:16 }}>{100-v}%</b></span>
      </div>
      <input type="range" min={0} max={100} value={v} onChange={e=>onChange(String(e.target.value))}
        style={{ width:"100%", accentColor:ACCENT, cursor:"pointer" }} />
      <div style={{ display:"flex", height:8, borderRadius:4, overflow:"hidden", marginTop:6 }}>
        <div style={{ width:`${v}%`, background:ACCENT, transition:"width .2s" }} />
        <div style={{ flex:1, background:"#60a5fa" }} />
      </div>
    </div>
  );
}

function EditModal({ field, value, onSave, onClose }) {
  const [draft, setDraft] = useState(value);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)", zIndex:100,
      display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={onClose}>
      <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:28, width:"100%", maxWidth:480 }}
        onClick={e=>e.stopPropagation()}>
        <h3 style={{ margin:"0 0 16px", color:TEXT, fontSize:15 }}>✏️ 編集：{field.label}</h3>
        {field.type==="textarea"
          ? <textarea rows={5} value={draft} onChange={e=>setDraft(e.target.value)} style={{ ...inp, resize:"vertical" }}/>
          : <input value={draft} onChange={e=>setDraft(e.target.value)} style={inp}/>}
        <div style={{ display:"flex", gap:10, marginTop:16, justifyContent:"flex-end" }}>
          <button onClick={onClose} style={{ padding:"8px 20px", borderRadius:8, border:`1px solid ${BORDER}`, background:"transparent", color:MUTED, cursor:"pointer" }}>キャンセル</button>
          <button onClick={()=>{onSave(draft);onClose();}} style={{ padding:"8px 20px", borderRadius:8, border:"none", background:ACCENT, color:"#fff", cursor:"pointer", fontWeight:"bold" }}>保存</button>
        </div>
      </div>
    </div>
  );
}

function buildBody(companyName, answers) {
  const lines=[`会社名：${companyName||"未入力"}\n`];
  SECTIONS.forEach(s=>{
    lines.push(`\n■ ${s.title}`);
    s.fields.forEach(f=>{
      const v=answers[f.id];
      if(!v||(Array.isArray(v)&&v.length===0)) return;
      const d=Array.isArray(v)?v.join("、"):f.id==="ratio_recruit"?`採用 ${v}% / 集客 ${100-parseInt(v)}%`:v;
      lines.push(`  ${f.label}：${d}`);
    });
  });
  return lines.join("\n");
}

function ThanksPage({ companyName }) {
  return (
    <div style={{ minHeight:"100vh", background:DARK, color:TEXT, fontFamily:"sans-serif",
      display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ maxWidth:480, width:"100%", textAlign:"center" }}>
        <div style={{ width:88, height:88, borderRadius:"50%", background:"#14532d", border:"3px solid #16a34a",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:40, margin:"0 auto 24px" }}>✅</div>
        <h1 style={{ fontSize:24, fontWeight:"bold", color:TEXT, margin:"0 0 14px" }}>ご回答ありがとうございます！</h1>
        <p style={{ color:MUTED, fontSize:15, lineHeight:1.9, margin:"0 0 28px" }}>
          {companyName && <><span style={{ color:ACCENT, fontWeight:"bold" }}>{companyName}</span> 様、</>}
          ヒアリング内容を受け付けました。<br/>
          担当者より改めてご連絡いたします。<br/>
          しばらくお待ちください。
        </p>
        <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:14, padding:20, marginBottom:24, textAlign:"left" }}>
          <p style={{ color:MUTED, fontSize:13, margin:"0 0 10px", fontWeight:"bold" }}>📩 送信先</p>
          <div style={{ color:"#60a5fa", fontSize:13, marginBottom:4 }}>• info@creative-raja.com</div>
          <div style={{ color:"#60a5fa", fontSize:13 }}>• inagaki@toprank-partners.jp</div>
        </div>
        <div style={{ background:"#1e3a5f", border:`1px solid #3b82f6`, borderRadius:12, padding:16 }}>
          <p style={{ color:"#93c5fd", fontSize:13, margin:0, lineHeight:1.8 }}>
            📞 お急ぎの場合はこちらへ<br/>
            <b style={{ color:TEXT }}>クリエイティブラジャ</b><br/>
            <a href="https://www.creative-raja.com/" target="_blank" rel="noreferrer" style={{ color:"#60a5fa" }}>www.creative-raja.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("top"); // top | form | thanks | error
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [companyName, setCompanyName] = useState("");
  const [editTarget, setEditTarget] = useState(null);
  const [sending, setSending] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const setVal=(id,val)=>setAnswers(a=>({...a,[id]:val}));
  const clearVal=id=>setAnswers(a=>{const n={...a};delete n[id];return n;});
  const sec = SECTIONS[step-1];
  const progress = Math.round((step/SECTIONS.length)*100);

  const handleComplete = async () => {
    setSending(true);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          _subject: `【WEB制作ヒアリング】${companyName||"新規お客様"}`,
          company_name: companyName||"未入力",
          message: buildBody(companyName, answers),
          // 追加通知先（Formspree の CC 機能）
          _cc: "inagaki@toprank-partners.jp",
        }),
      });
      if (res.ok) {
        setPage("thanks");
      } else {
        const d = await res.json();
        throw new Error(d?.error||"送信失敗");
      }
    } catch(e) {
      setErrMsg(e.message||"不明なエラーが発生しました");
      setPage("error");
    } finally {
      setSending(false);
    }
  };

  if (page==="thanks") return <ThanksPage companyName={companyName}/>;

  if (page==="error") return (
    <div style={{ minHeight:"100vh", background:DARK, color:TEXT, fontFamily:"sans-serif",
      display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ maxWidth:480, width:"100%", textAlign:"center" }}>
        <div style={{ fontSize:52, marginBottom:16 }}>⚠️</div>
        <h2 style={{ color:"#fca5a5", marginBottom:12 }}>送信エラーが発生しました</h2>
        <p style={{ color:MUTED, fontSize:13, marginBottom:24 }}>{errMsg}</p>
        <button onClick={()=>{setPage("form");setStep(4);}}
          style={{ padding:"12px 28px", borderRadius:12, border:"none", background:ACCENT, color:"#fff", fontWeight:"bold", fontSize:15, cursor:"pointer" }}>
          ← 回答画面に戻る
        </button>
      </div>
    </div>
  );

  if (page==="top") return (
    <div style={{ minHeight:"100vh", background:DARK, color:TEXT, fontFamily:"sans-serif",
      display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ maxWidth:480, width:"100%", textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:12 }}>🚗</div>
        <h1 style={{ fontSize:22, fontWeight:"bold", color:TEXT, margin:"0 0 6px" }}>WEB制作ヒアリングシート</h1>
        <p style={{ color:MUTED, fontSize:13, marginBottom:28 }}>自動車業界特化版｜所要時間：約5〜10分</p>
        <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:14, padding:20, marginBottom:20, textAlign:"left" }}>
          <label style={{ display:"block", color:MUTED, fontSize:13, marginBottom:6 }}>会社名・店舗名 <span style={{ color:ACCENT }}>*</span></label>
          <input value={companyName} onChange={e=>setCompanyName(e.target.value)} placeholder="例：〇〇モータース" style={inp}/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:28 }}>
          {SECTIONS.map(s=>(
            <div key={s.id} style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:12, padding:14, textAlign:"left" }}>
              <div style={{ color:ACCENT, fontWeight:"bold", fontSize:12, marginBottom:4 }}>Step {s.id}</div>
              <div style={{ color:TEXT, fontSize:12 }}>{s.title}</div>
            </div>
          ))}
        </div>
        <button onClick={()=>setPage("form")}
          style={{ width:"100%", padding:14, borderRadius:12, border:"none", background:ACCENT, color:"#fff", fontSize:16, fontWeight:"bold", cursor:"pointer" }}>
          ヒアリングを開始する →
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:DARK, color:TEXT, fontFamily:"sans-serif" }}>
      {editTarget && <EditModal field={editTarget.field} value={answers[editTarget.field.id]||""} onSave={v=>setVal(editTarget.field.id,v)} onClose={()=>setEditTarget(null)}/>}

      <div style={{ background:CARD, borderBottom:`1px solid ${BORDER}`, padding:"12px 16px", position:"sticky", top:0, zIndex:10 }}>
        <div style={{ maxWidth:700, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <span style={{ fontSize:13, color:MUTED }}>🚗 {companyName&&<span style={{ color:ACCENT }}>{companyName}</span>}</span>
            <span style={{ fontSize:12, color:MUTED }}>Step {step} / {SECTIONS.length}</span>
          </div>
          <div style={{ height:4, background:BORDER, borderRadius:2 }}>
            <div style={{ height:"100%", width:`${progress}%`, background:ACCENT, borderRadius:2, transition:"width .3s" }}/>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:700, margin:"0 auto", padding:16 }}>
        <div style={{ marginBottom:20 }}>
          <div style={{ color:ACCENT, fontWeight:"bold", fontSize:13, marginBottom:4 }}>Step {sec.id} / {SECTIONS.length}</div>
          <h2 style={{ margin:"0 0 6px", fontSize:20, color:TEXT }}>{sec.title}</h2>
          <p style={{ margin:0, color:MUTED, fontSize:13 }}>{sec.desc}</p>
        </div>

        {sec.fields.map(f=>{
          if(f.id==="ratio_attract") return null;
          const v=answers[f.id];
          const hasVal=v!==undefined&&v!==""&&!(Array.isArray(v)&&v.length===0);
          return (
            <div key={f.id} style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:14, padding:18, marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                <label style={{ color:TEXT, fontWeight:"bold", fontSize:14 }}>{f.label}</label>
                <div style={{ display:"flex", gap:6 }}>
                  {(f.type==="text"||f.type==="textarea")&&hasVal&&(
                    <button onClick={()=>setEditTarget({field:f})} style={{ background:"#1e3a5f", border:"none", color:"#60a5fa", borderRadius:6, padding:"4px 10px", fontSize:11, cursor:"pointer" }}>✏️ 編集</button>
                  )}
                  {hasVal&&(
                    <button onClick={()=>clearVal(f.id)} style={{ background:"#3b1a1a", border:"none", color:"#f87171", borderRadius:6, padding:"4px 10px", fontSize:11, cursor:"pointer" }}>🗑️ 削除</button>
                  )}
                </div>
              </div>
              {f.type==="checkbox"&&<CheckboxGroup options={f.options} value={v||[]} onChange={val=>setVal(f.id,val)}/>}
              {f.type==="radio"&&<RadioGroup options={f.options} value={v||""} onChange={val=>setVal(f.id,val)}/>}
              {f.type==="text"&&(hasVal
                ? <div style={{ color:TEXT, fontSize:14, background:DARK, borderRadius:8, padding:"10px 14px" }}>{v}</div>
                : <input placeholder={f.placeholder} onBlur={e=>e.target.value&&setVal(f.id,e.target.value)} style={inp}/>
              )}
              {f.type==="textarea"&&(hasVal
                ? <div style={{ color:TEXT, fontSize:14, background:DARK, borderRadius:8, padding:"10px 14px", whiteSpace:"pre-wrap" }}>{v}</div>
                : <textarea rows={3} placeholder={f.placeholder} onBlur={e=>e.target.value&&setVal(f.id,e.target.value)} style={{ ...inp, resize:"vertical" }}/>
              )}
              {f.type==="percent"&&(
                <PercentField value={answers[f.id]||"50"} onChange={val=>{setVal(f.id,val);setVal(f.pair,String(100-parseInt(val)));}}/>
              )}
            </div>
          );
        })}

        <div style={{ display:"flex", gap:12, marginTop:24, paddingBottom:32 }}>
          <button onClick={()=>{step===1?setPage("top"):setStep(s=>s-1);}}
            style={{ flex:1, padding:12, borderRadius:12, border:`1px solid ${BORDER}`, background:"transparent", color:TEXT, fontSize:15, cursor:"pointer" }}>← 前へ</button>
          {step<SECTIONS.length
            ? <button onClick={()=>setStep(s=>s+1)}
                style={{ flex:2, padding:12, borderRadius:12, border:"none", background:ACCENT, color:"#fff", fontSize:15, fontWeight:"bold", cursor:"pointer" }}>次へ →</button>
            : <button onClick={handleComplete} disabled={sending}
                style={{ flex:2, padding:12, borderRadius:12, border:"none", background:sending?"#374151":"#16a34a", color:"#fff", fontSize:15, fontWeight:"bold", cursor:sending?"not-allowed":"pointer" }}>
                {sending?"📨 送信中...":"✅ 回答を送信する"}
              </button>
          }
        </div>
      </div>
    </div>
  );
}
