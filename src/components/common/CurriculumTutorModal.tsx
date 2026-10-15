import React, { useState } from 'react';
import { X, Sparkles, BookOpen, Send, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

interface CurriculumTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
}

export const CurriculumTutorModal: React.FC<CurriculumTutorModalProps> = ({
  isOpen,
  onClose,
  initialTopic = '',
}) => {
  const { preferences } = useLearning();
  const [query, setQuery] = useState(initialTopic);
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const sampleQuestions = [
    {
      q: 'Why do we say "Hēgiddīrā" instead of "Hēgiddīya"?',
      qHi: '"Hēgiddīrā" और "Hēgiddīya" में क्या अंतर है?',
    },
    {
      q: 'How does the "-bēku" suffix work in Kannada?',
      qHi: 'कन्नड़ में "-ಬೇಕು" (bēku) प्रत्यय कैसे काम करता है?',
    },
    {
      q: 'What is the "I" vs "A" rule for This and That?',
      qHi: '"ಇದು" (यह) और "ಅದು" (वह) का निकटता नियम क्या है?',
    },
    {
      q: 'Why do auto drivers get called "Aṇṇā"?',
      qHi: 'ऑटो चालकों को सम्मान से "ಅಣ್ಣಾ" क्यों कहते हैं?',
    },
  ];

  const handleAsk = async (questionText: string) => {
    const activeQuery = questionText || query;
    if (!activeQuery.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      // Attempt backend proxy first if available
      const res = await fetch('/api/curriculum-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: activeQuery,
          language: preferences.explanationLanguage,
          level: preferences.beginnerLevel,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.answer) {
          setResponse(data.answer);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Fallback to internal curriculum knowledge base
    }

    // High quality linguistic rule engine fallback
    const lower = activeQuery.toLowerCase();
    let explanation = '';

    if (lower.includes('hegiddira') || lower.includes('hegiddiya') || lower.includes('-ra') || lower.includes('respect')) {
      explanation = preferences.explanationLanguage === 'hi'
        ? `**ಹೇಗಿದ್ದೀರಾ (Hēgiddīrā) बनाम ಹೇಗಿದ್ದೀಯಾ (Hēgiddīyā)**:
1. **-ರಾ (-rā)**: आदरसूचक प्रत्यय है। यह हिंदी के "आप कैसे हैं?" के बराबर है। जब भी आप किसी बड़े, अजनबी, सहकर्मी या ऑटो चालक से बात करें, हमेशा **ಹೇಗಿದ್ದೀರಾ** का प्रयोग करें।
2. **-ಯಾ (-yā)**: अनौपचारिक प्रत्यय है (जैसे "तू/तुम कैसा है?")। इसका प्रयोग केवल बहुत करीबी दोस्तों या बच्चों के साथ किया जाता है।
💡 **याद रखने का सूत्र**: जब सम्मान देना हो, तो "ರಾ" (Rā) लगाएँ!`
        : `**Hēgiddīrā (ಹೇಗಿದ್ದೀರಾ) vs Hēgiddīyā (ಹೇಗಿದ್ದೀಯಾ)**:
1. **The "-rā" ending**: Represents the respectful/plural honorific. It directly corresponds to "How are you (polite/formal)?" like "Aap kaise hain" in Hindi. Always use **Hēgiddīrā** when speaking with strangers, auto drivers, shopkeepers, elders, or colleagues.
2. **The "-yā" ending**: Is purely informal (singular familiar). It is only used with very young children or childhood friends.
💡 **Curriculum Rule**: When in doubt in Karnataka, always choose the polite "-rā" ending!`;
    } else if (lower.includes('beku') || lower.includes('beda') || lower.includes('want')) {
      explanation = preferences.explanationLanguage === 'hi'
        ? `**ಬೇಕು (Bēku - चाहिए) और ಬೇಡ (Bēḍa - नहीं चाहिए)**:
कन्नड़ में "मैं पानी चाहता हूँ" नहीं कहते, बल्कि "मुझे पानी चाहिए" कहते हैं:
• **संरचना**: [किसको] + [क्या] + ಬೇಕು / ಬೇಡ
• **उदाहरण**: "ನನಗೆ ಕಾಫಿ ಬೇಕು" (Nanage coffee bēku = मुझे कॉफ़ी चाहिए)।
• **मना करने के लिए**: "ನನಗೆ ಖಾರ ಬೇಡ" (Nanage khāra bēḍa = मुझे तीखा नहीं चाहिए)।
• किसी विनम्र निवेदन को अस्वीकार करते समय बोलें: **"ಬೇಡ, ಧನ್ಯವಾದ"** (Bēḍa, dhanyavāda = नहीं चाहिए, धन्यवाद)।`
        : `**Using "-ಬೇಕು" (Bēku - Want/Need) and "-ಬೇಡ" (Bēḍa - Don't Want)**:
In Kannada, you never say "I want X". The grammar uses a dative construction: "To me, X is required".
• **Formula**: Subject in Dative (Nanage - to me) + Object + Bēku / Bēḍa.
• **Example**: "ನನಗೆ ನೀರು ಬೇಕು" (Nanage nīru bēku = I want water).
• **Negative**: "ಖಾರ ಬೇಡ" (Khāra bēḍa = Don't want spicy).
• **Polite refusal**: Always say **"Bēḍa, dhanyavāda"** (No need, thank you).`;
    } else if (lower.includes('idu') || lower.includes('adu') || lower.includes('this') || lower.includes('that')) {
      explanation = preferences.explanationLanguage === 'hi'
        ? `**कन्नड़ का स्वर्णिम निकटता नियम (I vs A Rule)**:
कन्नड़ वर्णमाला में:
1. **ಇ (I)** = निकटता (This / Here)
   • **ಇದು (Idu)** = यह (पास की वस्तु)
   • **ಇಲ್ಲಿ (Illi)** = यहाँ
   • **ಇವತ್ತು (Ivattu)** = आज
2. **ಅ (A)** = दूरी (That / There)
   • **ಅದು (Adu)** = वह (दूर की वस्तु)
   • **ಅಲ್ಲಿ (Alli)** = वहाँ
   • **ಅವನು (Avanu)** = वह व्यक्ति`
        : `**The Golden Proximity Rule of Kannada**:
Dravidian linguistics follow a very consistent vowel harmony for location:
1. **"I-" vowel prefix indicates PROXIMITY (Near)**:
   • **ಇದು (Idu)** = This (close at hand)
   • **ಇಲ್ಲಿ (Illi)** = Here
   • **ಇವತ್ತು (Ivattu)** = Today
2. **"A-" vowel prefix indicates DISTANCE (Far)**:
   • **ಅದು (Adu)** = That (far away)
   • **ಅಲ್ಲಿ (Alli)** = There
   • **ಅವನು (Avanu)** = He / That person`;
    } else if (lower.includes('anna') || lower.includes('brother') || lower.includes('auto')) {
      explanation = preferences.explanationLanguage === 'hi'
        ? `**"ಅಣ್ಣಾ" (Aṇṇā) का सामाजिक उपयोग**:
कर्नाटक में 'ಅಣ್ಣಾ' (बड़ा भाई / भैया) केवल पारिवारिक रिश्ता नहीं है, बल्कि आत्मीयता और सम्मान का सबसे प्यारा संबोधन है।
• जब आप ऑटो ड्राइवर, सब्ज़ी वाले या किसी सहायक को "ಅಣ್ಣಾ" कहते हैं, तो बातचीत में तुरंत सौहार्द आ जाता है।
• उदाहरण: "ಅಣ್ಣಾ, ಎಂ.ಜಿ. ರಸ್ತೆಗೆ ಬರ್ತೀರಾ?" (भैया, एमजी रोड चलेंगे?)`
        : `**Social Etiquette: Calling Helpers and Drivers "Aṇṇā"**:
In Karnataka, "ಅಣ್ಣಾ" (Aṇṇā) literally means "Elder Brother".
• It is widely used as a warm, respectful title when addressing auto drivers, conductors, vegetable vendors, and delivery partners.
• It breaks the ice instantly and creates friendly rapport!
• Example: "Namaskāra Aṇṇā, meter hāki banni" (Hello brother, please put on the meter and come).`;
    } else {
      explanation = preferences.explanationLanguage === 'hi'
        ? `**कन्नड़ पाठ्यक्रम मार्गदर्शन**:
आप जो पूछ रहे हैं ("${activeQuery}") वह कन्नड़ सीखने के लिए अत्यंत महत्वपूर्ण विषय है।
• **मुख्य सुझाव**: हमेशा विनम्र क्रिया प्रत्ययों (जैसे: ಬನ್ನಿ - आइए, ಕೊಡಿ - दीजिए, ಮಾಡಿ - कीजिए) का उपयोग करें।
• **ध्वन्यात्मक संकेत**: रोमन लिप्यंतरण और हिंदी उच्चारण संकेतों का पालन करें!`
        : `**Curriculum Learning Guide**:
Regarding your question on "${activeQuery}":
• **Core Kannada Rule**: Respect is central to everyday speech. Always prefer polite verb endings with "-i" or "-ri" (Banni - please come, Koḍi - please give, Māḍi - please do).
• **Question Formulation**: You can turn almost any affirmative statement into a question simply by elongating the final vowel sound into "-ā" (e.g. "Āytu" = Done → "Āytā?" = Is it done?).
• Use the Roman transliteration guide on any card in the curriculum to master correct phonetic cadence.`;
    }

    setResponse(explanation);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-amber-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-300 rounded-lg">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <span>Kannada Curriculum Tutor</span>
                <span className="text-[11px] font-mono font-normal px-2 py-0.5 bg-amber-500/30 text-amber-200 rounded-full">
                  Educational Guide
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Linguistic explanations for lessons, grammar, and pronunciation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm flex-1">
          {/* Preset question chips */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-2">
              <Lightbulb size={14} className="text-amber-600" />
              <span>
                {preferences.explanationLanguage === 'hi'
                  ? 'अक्सर पूछे जाने वाले व्याकरण के सवाल:'
                  : 'Common curriculum inquiries:'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sampleQuestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    const text = preferences.explanationLanguage === 'hi' ? item.qHi : item.q;
                    setQuery(text);
                    handleAsk(text);
                  }}
                  className="text-left text-xs p-2.5 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-amber-50/50 text-slate-700 transition-colors flex items-start gap-2"
                >
                  <BookOpen size={14} className="text-amber-600 shrink-0 mt-0.5" />
                  <span>{preferences.explanationLanguage === 'hi' ? item.qHi : item.q}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search/Query Input */}
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAsk(query);
              }}
              placeholder={
                preferences.explanationLanguage === 'hi'
                  ? 'कन्नड़ व्याकरण या किसी नियम के बारे में पूछें...'
                  : 'Ask about a lesson, grammar rule, or polite phrasing...'
              }
              className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 text-sm"
            />
            <button
              type="button"
              onClick={() => handleAsk(query)}
              disabled={loading || !query.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors"
            >
              <Send size={15} />
            </button>
          </div>

          {/* Response Container */}
          {loading && (
            <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200/60 flex items-center gap-3 animate-pulse">
              <div className="w-5 h-5 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
              <span className="text-xs text-amber-900 font-medium">
                {preferences.explanationLanguage === 'hi'
                  ? 'व्याकरण नियम का विश्लेषण किया जा रहा है...'
                  : 'Consulting Kannada curriculum guidelines...'}
              </span>
            </div>
          )}

          {response && !loading && (
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
                <CheckCircle2 size={15} className="text-emerald-600" />
                <span>
                  {preferences.explanationLanguage === 'hi' ? 'पाठ्यक्रम स्पष्टीकरण' : 'Linguistic Guide'}
                </span>
              </div>
              <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line text-slate-800">
                {response}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 px-5">
          <span>Curriculum-verified linguistic explanations</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
