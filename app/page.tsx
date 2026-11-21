"use client";

import { useEffect, useState } from "react";
import { Building2, CheckCircle2, ChevronLeft, LockKeyhole, LogOut, Mail, Plus, Trash2, Users } from "lucide-react";

type Person = { id: string; name: string; email: string; room: string; score: number; answers: string[] };
type Question = { id: string; text: string; options: string[] };

const initialQuestions: Question[] = [
  { id: "q1", text: "Pilih tujuan utama rapat H.O.D", options: ["Perencanaan operasional", "Evaluasi kinerja", "Koordinasi lintas departemen", "Penyusunan anggaran"] },
  { id: "q2", text: "Metode pengambilan keputusan paling tepat", options: ["Berdasarkan asumsi", "Berdasarkan data", "Berdasarkan kepentingan pribadi", "Berdasarkan keputusan paling lama"] },
  { id: "q3", text: "Prioritas utama saat terjadi masalah operasional", options: ["Menyalahkan tim", "Menunda tindakan", "Menjaga keselamatan dan menyelesaikan masalah", "Menunggu arahan"] }
];

const initialPeople: Person[] = [
  { id: "1", name: "Andi Pratama", email: "andi@example.com", room: "Kamar 101", score: 0, answers: [] },
  { id: "2", name: "Budi Santoso", email: "budi@example.com", room: "Kamar 101", score: 0, answers: [] },
  { id: "3", name: "Citra Dewi", email: "citra@example.com", room: "Kamar 102", score: 0, answers: [] }
];

export default function Home() {
  const [view, setView] = useState("home");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [current, setCurrent] = useState<Person | null>(null);
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [adminPass, setAdminPass] = useState("");
  const [adminError, setAdminError] = useState("");

  useEffect(() => {
    const p = localStorage.getItem("hodPeople");
    const q = localStorage.getItem("hodQuestions");
    if (p) setPeople(JSON.parse(p));
    if (q) setQuestions(JSON.parse(q));
  }, []);

  useEffect(() => { localStorage.setItem("hodPeople", JSON.stringify(people)); }, [people]);
  useEffect(() => { localStorage.setItem("hodQuestions", JSON.stringify(questions)); }, [questions]);

  function sendOtp() {
    const p = people.find(x => x.email.toLowerCase() === email.trim().toLowerCase());
    if (!p) { alert("Email belum terdaftar. Hubungi admin."); return; }
    setCurrent(p); setView("otp");
  }

  function verify() { if (otp === "123456") setView("quiz"); else alert("OTP demo salah. Gunakan 123456."); }

  function submit() {
    if (!current || answers.some(x => !x)) { alert("Jawab semua pertanyaan terlebih dahulu."); return; }
    const correct = [1, 1, 2];
    const score = answers.filter((a, i) => a === questions[i]?.options[correct[i]]).length;
    const p = { ...current, score, answers: [...answers] };
    setPeople(old => old.map(x => x.id === p.id ? p : x)); setCurrent(p); setView("result");
  }

  function loginAdmin() { if (adminPass === "admin123") setView("admin"); else setAdminError("Password demo: admin123"); }

  return <main style={{ minHeight: "100vh" }}>
    {view !== "admin" && <header style={{ height: 72, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e7eaf0", background: "white" }}>
      <b style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 19 }}><span style={{ width: 38, height: 38, borderRadius: 12, background: "#2d5be3", display: "grid", placeItems: "center", color: "white" }}><Building2 size={21} /></span>H.O.D Meeting</b>
      {view !== "home" && <button onClick={() => setView("home")} style={{ border: 0, background: "transparent", display: "flex", alignItems: "center", gap: 6 }}><ChevronLeft size={18} />Kembali</button>}
    </header>}

    {view === "home" && <div style={{ maxWidth: 1050, margin: "44px auto", padding: "0 20px", display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: 28 }}>
      <section className="card" style={{ padding: 40 }}>
        <small style={{ color: "#2d5be3", fontWeight: 800, letterSpacing: 1 }}>H.O.D MEETING</small>
        <h1 style={{ fontSize: 42, lineHeight: 1.1, margin: "15px 0" }}>Registrasi & pembagian kamar</h1>
        <p style={{ color: "#69738a", lineHeight: 1.7 }}>Masukkan email terdaftar untuk mengikuti kuis dan melihat kamar Anda.</p>
        <label style={{ fontWeight: 700, display: "block", marginTop: 24, marginBottom: 8 }}>Email peserta</label>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ position: "relative", flex: 1 }}><Mail size={18} style={{ position: "absolute", left: 13, top: 15, color: "#8791a5" }} /><input value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" style={{ width: "100%", height: 48, padding: "0 12px 0 40px", border: "1px solid #dfe3ec", borderRadius: 11 }} /></div>
          <button onClick={sendOtp} style={{ border: 0, borderRadius: 11, background: "#2d5be3", color: "white", padding: "0 20px", fontWeight: 800 }}>Lanjut</button>
        </div>
        <p style={{ fontSize: 12, color: "#69738a" }}>Demo: andi@example.com, budi@example.com, citra@example.com · OTP 123456</p>
      </section>
      <section className="card" style={{ padding: 32, display: "grid", placeItems: "center", textAlign: "center" }}>
        <div><div style={{ width: 62, height: 62, borderRadius: "50%", background: "#edf2ff", display: "grid", placeItems: "center", margin: "auto", color: "#2d5be3" }}><Users size={30} /></div><h2>Area Admin</h2><p style={{ color: "#69738a", fontSize: 14 }}>Kelola peserta, soal kuis, dan kamar.</p><button onClick={() => setView("admin")} style={{ border: "1px solid #dfe3ec", background: "white", borderRadius: 10, padding: "11px 20px", fontWeight: 700 }}>Buka Dashboard</button></div>
      </section>
    </div>}

    {view === "otp" && <div style={{ maxWidth: 430, margin: "70px auto", padding: "0 20px" }}><section className="card" style={{ padding: 34, textAlign: "center" }}><LockKeyhole color="#2d5be3" /><h2>Verifikasi email</h2><p style={{ color: "#69738a" }}>OTP demo untuk uji coba: <b>123456</b></p><input value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" style={{ width: "100%", height: 56, textAlign: "center", letterSpacing: 8, fontSize: 24, border: "1px solid #dfe3ec", borderRadius: 12 }} /><button onClick={verify} style={{ width: "100%", height: 48, marginTop: 12, border: 0, borderRadius: 10, background: "#2d5be3", color: "white", fontWeight: 800 }}>Verifikasi</button></section></div>}

    {view === "quiz" && current && <div style={{ maxWidth: 720, margin: "35px auto", padding: "0 20px" }}><h2>Halo, {current.name}</h2><p>Jawab semua pertanyaan berikut.</p>{questions.map((q, i) => <section className="card" key={q.id} style={{ padding: 20, marginBottom: 14 }}><b>{i + 1}. {q.text}</b>{q.options.map(o => <label key={o} style={{ display: "flex", gap: 10, padding: 11, marginTop: 7, border: "1px solid #e7eaf0", borderRadius: 9 }}><input type="radio" name={q.id} checked={answers[i] === o} onChange={() => setAnswers(a => a.map((v, j) => j === i ? o : v))} />{o}</label>)}</section>)}<button onClick={submit} style={{ width: "100%", height: 50, border: 0, borderRadius: 11, background: "#2d5be3", color: "white", fontWeight: 800 }}>Kirim jawaban</button></div>}

    {view === "result" && current && <div style={{ maxWidth: 480, margin: "70px auto", padding: "0 20px", textAlign: "center" }}><section className="card" style={{ padding: 40 }}><CheckCircle2 size={50} color="#1e9e61" /><p style={{ color: "#69738a" }}>Kamar Anda</p><h1 style={{ fontSize: 42 }}>{current.room || "Belum ditentukan"}</h1><p>Terima kasih sudah menyelesaikan kuis. Skor: {current.score}/3</p><button onClick={() => setView("home")} style={{ border: 0, borderRadius: 10, padding: 12 }}>Selesai</button></section></div>}

    {view === "admin" && <Admin people={people} setPeople={setPeople} />}
  </main>;
}

function Admin({ people, setPeople }: { people: Person[]; setPeople: (p: Person[]) => void }) {
  const [pass, setPass] = useState("");
  const [ok, setOk] = useState(false);
  const [tab, setTab] = useState("peserta");
  const add = () => setPeople([...people, { id: crypto.randomUUID(), name: "Peserta Baru", email: "peserta@email.com", room: "Kamar 101", score: 0, answers: [] }]);
  const edit = (id: string, key: "name" | "email" | "room", value: string) => setPeople(people.map(p => p.id === id ? { ...p, [key]: value } : p));

  if (!ok) return <div style={{ maxWidth: 420, margin: "100px auto", padding: "0 20px" }}><section className="card" style={{ padding: 32, textAlign: "center" }}><LockKeyhole color="#2d5be3" /><h2>Login Admin</h2><input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Password" style={{ width: "100%", height: 46, padding: 12, border: "1px solid #ddd", borderRadius: 9 }} /><button onClick={() => pass === "admin123" ? setOk(true) : alert("Password demo: admin123")} style={{ width: "100%", height: 46, marginTop: 10, border: 0, borderRadius: 9, background: "#2d5be3", color: "white" }}>Masuk</button><small>Password demo: admin123</small></section></div>;

  return <div style={{ minHeight: "100vh", background: "#f5f7fb" }}>
    <header style={{ height: 72, padding: "0 25px", background: "white", display: "flex", alignItems: "center", justifyContent: "space-between" }}><b style={{ display: "flex", alignItems: "center", gap: 8 }}><Building2 size={20} /> H.O.D Meeting Admin</b><button onClick={() => location.reload()} style={{ border: 0, background: "transparent", display: "flex", alignItems: "center", gap: 6 }}><LogOut size={17} />Keluar</button></header>
    <div style={{ maxWidth: 1100, margin: "30px auto", padding: "0 20px" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>{["peserta", "kuis"].map(t => <button key={t} onClick={() => setTab(t)} style={{ border: 0, borderRadius: 9, padding: "11px 16px", background: tab === t ? "#2d5be3" : "white", color: tab === t ? "white" : "#46516a" }}>{t === "peserta" ? "Peserta" : "Kuis"}</button>)}</div>
      {tab === "peserta" ? <section className="card" style={{ overflow: "hidden" }}><div style={{ padding: 18, display: "flex", justifyContent: "space-between", borderBottom: "1px solid #eee" }}><b>Daftar peserta ({people.length})</b><button onClick={add} style={{ border: 0, borderRadius: 8, padding: 9, background: "#2d5be3", color: "white", display: "flex", alignItems: "center", gap: 5 }}><Plus size={15} />Tambah peserta</button></div><div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse" }}><thead><tr style={{ textAlign: "left" }}><th style={{ padding: 12 }}>Nama</th><th>Email</th><th>Kamar</th><th>Skor</th><th></th></tr></thead><tbody>{people.map(p => <tr key={p.id} style={{ borderTop: "1px solid #eee" }}><td style={{ padding: 12 }}><input value={p.name} onChange={e => edit(p.id, "name", e.target.value)} style={{ border: 0, width: 140 }} /></td><td><input value={p.email} onChange={e => edit(p.id, "email", e.target.value)} style={{ border: 0, width: 190 }} /></td><td><input value={p.room} onChange={e => edit(p.id, "room", e.target.value)} style={{ border: 0, width: 110 }} /></td><td>{p.score}/3</td><td><button onClick={() => setPeople(people.filter(x => x.id !== p.id))} style={{ border: 0, color: "#c33", background: "transparent" }}><Trash2 size={16} /></button></td></tr>)}</tbody></table></div></section> : <div className="card" style={{ padding: 20 }}>Pengelolaan soal tersedia pada versi terintegrasi database.</div>}
    </div>
  </div>;
}
