
import React, { useState, useCallback } from 'react';
import { getHealthAdvice } from './services/geminiService';
import { BMIResult, HealthAdvice } from './types';
import BMIGauge from './components/BMIGauge';

const App: React.FC = () => {
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [age, setAge] = useState<string>('25');
  const [gender, setGender] = useState<string>('female');
  const [result, setResult] = useState<BMIResult | null>(null);
  const [advice, setAdvice] = useState<HealthAdvice | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const calculateBMI = useCallback(async () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;

    if (!w || !h) return;

    const bmiValue = w / (h * h);
    let category = '';
    let color = '';

    if (bmiValue < 18.5) {
      category = 'น้ำหนักน้อย / ผอม';
      color = 'text-blue-400';
    } else if (bmiValue < 25) {
      category = 'ปกติ (สุขภาพดี)';
      color = 'text-green-500';
    } else if (bmiValue < 30) {
      category = 'น้ำหนักเกิน';
      color = 'text-yellow-500';
    } else {
      category = 'อ้วน';
      color = 'text-red-400';
    }

    setResult({ bmi: bmiValue, category, color });
    setLoading(true);

    try {
      const healthAdvice = await getHealthAdvice(bmiValue, category, parseInt(age), gender);
      setAdvice(healthAdvice);
    } catch (error) {
      console.error("AI fetch failed", error);
    } finally {
      setLoading(false);
    }
  }, [weight, height, age, gender]);

  return (
    <div className="p-4 md:p-8 flex flex-col items-center">
      <header className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-pink-400 mb-2 drop-shadow-sm">
          Pastel BMI Magic ✨
        </h1>
        <p className="text-gray-500 font-medium">คำนวณดัชนีมวลกายพร้อมคำแนะนำจาก AI</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Left Side: Input Form */}
        <section className="pastel-card rounded-3xl p-8 shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
            <span className="bg-pink-100 p-2 rounded-lg text-xl">📝</span> ข้อมูลของคุณ
          </h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">อายุ (ปี)</label>
                <input 
                  type="number" 
                  value={age} 
                  onChange={(e) => setAge(e.target.value)}
                  className="bg-white/50 border-2 border-pink-50 rounded-2xl p-4 focus:border-pink-200 outline-none transition-all text-lg"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">เพศ</label>
                <select 
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="bg-white/50 border-2 border-pink-50 rounded-2xl p-4 focus:border-pink-200 outline-none transition-all text-lg appearance-none cursor-pointer"
                >
                  <option value="female">ผู้หญิง 🌸</option>
                  <option value="male">ผู้ชาย 👕</option>
                  <option value="other">อื่นๆ ✨</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">น้ำหนัก (กก.)</label>
              <input 
                type="number" 
                placeholder="เช่น 55"
                value={weight} 
                onChange={(e) => setWeight(e.target.value)}
                className="bg-white/50 border-2 border-blue-50 rounded-2xl p-4 focus:border-blue-200 outline-none transition-all text-lg"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">ส่วนสูง (ซม.)</label>
              <input 
                type="number" 
                placeholder="เช่น 165"
                value={height} 
                onChange={(e) => setHeight(e.target.value)}
                className="bg-white/50 border-2 border-purple-50 rounded-2xl p-4 focus:border-purple-200 outline-none transition-all text-lg"
              />
            </div>

            <button 
              onClick={calculateBMI}
              className="w-full bg-gradient-to-r from-pink-300 to-purple-300 hover:from-pink-400 hover:to-purple-400 text-white font-bold py-4 rounded-2xl shadow-lg transform active:scale-95 transition-all text-xl mt-4"
            >
              คำนวณเลย 🚀
            </button>
          </div>
        </section>

        {/* Right Side: Results & AI Advice */}
        <section className="flex flex-col gap-6">
          {result ? (
            <div className="pastel-card rounded-3xl p-8 shadow-xl animate-fadeIn">
              <div className="text-center">
                <p className="text-sm font-bold text-gray-400 uppercase mb-1">ผลลัพธ์ของคุณ</p>
                <div className="text-6xl font-black text-gray-800 mb-2">
                  {result.bmi.toFixed(1)}
                </div>
                {/* Fix: Corrected template literal escaping */}
                <div className={`text-2xl font-bold ${result.color} mb-4`}>
                  {result.category}
                </div>
                <BMIGauge bmi={result.bmi} />
                <div className="flex justify-between text-[10px] text-gray-400 px-1">
                  <span>ผอม</span>
                  <span>ปกติ</span>
                  <span>อ้วน</span>
                </div>
              </div>

              {loading ? (
                <div className="mt-10 flex flex-col items-center gap-4 py-8">
                  <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
                  <p className="text-pink-400 animate-pulse font-medium">Gemini AI กำลังวิเคราะห์สุขภาพ...</p>
                </div>
              ) : advice && (
                <div className="mt-8 space-y-6 animate-slideUp">
                  <div className="bg-white/60 p-4 rounded-2xl border border-white">
                    <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-2">
                      <span>💡</span> บทสรุปสุขภาพ
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{advice.summary}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                      <h3 className="font-bold text-blue-600 flex items-center gap-2 mb-3">
                        <span>🏃‍♂️</span> กิจกรรมแนะนำ
                      </h3>
                      <ul className="space-y-2">
                        {advice.recommendations.map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex gap-2">
                            <span className="text-blue-300">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100">
                      <h3 className="font-bold text-green-600 flex items-center gap-2 mb-3">
                        <span>🥗</span> การรับประทานอาหาร
                      </h3>
                      <ul className="space-y-2">
                        {advice.dietTips.map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex gap-2">
                            <span className="text-green-300">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="pastel-card rounded-3xl p-12 shadow-xl flex flex-col items-center justify-center text-center h-full opacity-60">
              <div className="text-6xl mb-4">🌈</div>
              <h3 className="text-xl font-bold text-gray-400">ใส่ข้อมูลของคุณทางซ้าย<br/>เพื่อเริ่มการวิเคราะห์มหัศจรรย์</h3>
            </div>
          )}
        </section>
      </div>

      <footer className="mt-12 text-gray-400 text-sm pb-8">
        © {new Date().getFullYear()} Pastel BMI Magic | Powered by Gemini 3 Flash
      </footer>

      {/* Fix: Template literal within style tag was improperly escaped */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default App;
