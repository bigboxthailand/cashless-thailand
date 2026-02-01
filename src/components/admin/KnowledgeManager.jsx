import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function KnowledgeManager() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'unanswered', 'answered'
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [answer, setAnswer] = useState('');
    const [category, setCategory] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, [filter]);

    async function fetchQuestions() {
        setLoading(true);
        let query = supabase
            .from('unanswered_questions')
            .select('*')
            .order('frequency', { ascending: false })
            .order('asked_at', { ascending: false });

        if (filter === 'unanswered') {
            query = query.eq('answered', false);
        } else if (filter === 'answered') {
            query = query.eq('answered', true);
        }

        const { data, error } = await query;
        if (error) {
            console.error('Error fetching questions:', error);
        } else {
            setQuestions(data || []);
        }
        setLoading(false);
    }

    async function saveAnswer() {
        if (!selectedQuestion || !answer.trim()) return;

        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();

        // Update question with answer
        const { error } = await supabase
            .from('unanswered_questions')
            .update({
                answered: true,
                admin_answer: answer,
                admin_id: user?.id,
                answered_at: new Date().toISOString(),
                category: category || null
            })
            .eq('id', selectedQuestion.id);

        if (error) {
            alert('Error saving answer: ' + error.message);
        } else {
            // Append to knowledge base file
            await appendToKnowledgeBase(selectedQuestion.question, answer, category);
            alert('✅ Answer saved and added to knowledge base!');
            setSelectedQuestion(null);
            setAnswer('');
            setCategory('');
            fetchQuestions();
        }
        setSaving(false);
    }

    async function appendToKnowledgeBase(question, answer, category) {
        // Call API endpoint to append to ADMIN_ANSWERS.md
        try {
            await fetch('/api/append-knowledge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question, answer, category })
            });
        } catch (e) {
            console.error('Failed to append to knowledge base:', e);
        }
    }

    async function deleteQuestion(id) {
        if (!confirm('Delete this question?')) return;
        const { error } = await supabase.from('unanswered_questions').delete().eq('id', id);
        if (!error) fetchQuestions();
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">📚 Knowledge Base Manager</h1>
                <p className="text-white/60">Review and answer questions the chatbot couldn't handle</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
                {['unanswered', 'answered', 'all'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg font-medium transition ${filter === f
                                ? 'bg-[#D4AF37] text-black'
                                : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                    >
                        {f === 'unanswered' && '❓ Unanswered'}
                        {f === 'answered' && '✅ Answered'}
                        {f === 'all' && '📋 All'}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="text-center py-12 text-white/60">Loading...</div>
            ) : questions.length === 0 ? (
                <div className="text-center py-12 text-white/60">
                    No {filter} questions found
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Questions List */}
                    <div className="space-y-3">
                        {questions.map(q => (
                            <div
                                key={q.id}
                                onClick={() => setSelectedQuestion(q)}
                                className={`p-4 rounded-lg cursor-pointer transition ${selectedQuestion?.id === q.id
                                        ? 'bg-[#D4AF37]/20 border-2 border-[#D4AF37]'
                                        : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <span className="text-white font-medium">{q.question}</span>
                                    {q.frequency > 1 && (
                                        <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded">
                                            {q.frequency}x
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-white/40">
                                    <span>{new Date(q.asked_at).toLocaleDateString('th-TH')}</span>
                                    <span>•</span>
                                    <span>{q.reason}</span>
                                    {q.category && (
                                        <>
                                            <span>•</span>
                                            <span className="text-[#D4AF37]">{q.category}</span>
                                        </>
                                    )}
                                </div>
                                {q.answered && (
                                    <div className="mt-2 text-xs text-green-400">
                                        ✓ Answered by Admin
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Answer Form */}
                    {selectedQuestion && (
                        <div className="bg-white/5 p-6 rounded-lg sticky top-6 h-fit">
                            <h3 className="text-xl font-bold text-white mb-4">
                                {selectedQuestion.answered ? '✅ Answered' : '📝 Answer Question'}
                            </h3>

                            <div className="mb-4">
                                <label className="block text-white/60 text-sm mb-2">Question:</label>
                                <div className="p-3 bg-white/10 rounded text-white">
                                    {selectedQuestion.question}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-white/60 text-sm mb-2">Category:</label>
                                <select
                                    value={category || selectedQuestion.category || ''}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
                                    disabled={selectedQuestion.answered}
                                >
                                    <option value="">Select category...</option>
                                    <option value="product">Product</option>
                                    <option value="bitcoin">Bitcoin/Crypto</option>
                                    <option value="system">System/Manual</option>
                                    <option value="payment">Payment</option>
                                    <option value="shipping">Shipping</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-white/60 text-sm mb-2">Answer:</label>
                                <textarea
                                    value={answer || selectedQuestion.admin_answer || ''}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    className="w-full p-3 bg-white/10 border border-white/20 rounded text-white h-40"
                                    placeholder="Type your answer here..."
                                    disabled={selectedQuestion.answered}
                                />
                            </div>

                            <div className="flex gap-2">
                                {!selectedQuestion.answered && (
                                    <button
                                        onClick={saveAnswer}
                                        disabled={saving || !answer.trim()}
                                        className="flex-1 px-4 py-2 bg-[#D4AF37] text-black font-bold rounded hover:scale-105 transition disabled:opacity-50"
                                    >
                                        {saving ? 'Saving...' : '💾 Save Answer'}
                                    </button>
                                )}
                                <button
                                    onClick={() => deleteQuestion(selectedQuestion.id)}
                                    className="px-4 py-2 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition"
                                >
                                    🗑️
                                </button>
                            </div>

                            {selectedQuestion.answered && (
                                <div className="mt-4 text-xs text-white/40">
                                    Answered on {new Date(selectedQuestion.answered_at).toLocaleString('th-TH')}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
