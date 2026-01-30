import React, { useState, useEffect } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

// PUBLIC BETA KEY for testing (Rate limited, but works for demos)
const GIPHY_API_KEY = '0KQDTWkrnMGBzFx84hRKRrupPZhmMhnr';

// Default Stickers (Fail-safe)
const DEFAULT_STICKERS = [
    // ROW 1: Cute / Hello
    { id: 'pikachu_hi', url: 'https://i.giphy.com/media/slVWEctHZKvWU/giphy.gif' },
    { id: 'pusheen_love', url: 'https://i.giphy.com/media/108M7gCS1JSoO4/giphy.gif' },
    { id: 'minion_bounce', url: 'https://i.giphy.com/media/11sBLVxNs7v6WA/giphy.gif' },

    // ROW 2: Reactions
    { id: 'cat_typing', url: 'https://i.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif' },
    { id: 'heart_spin', url: 'https://i.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif' },
    { id: 'patrick_shock', url: 'https://i.giphy.com/media/l4pFpKSrtWe2O4lbi/giphy.gif' }, // REPLACED doge_wow

    // ROW 3: Vibes
    { id: 'money_rain', url: 'https://i.giphy.com/media/l0Ex6kAKAoFRsFh6M/giphy.gif' },
    { id: 'spongebob_yay', url: 'https://i.giphy.com/media/nDSlfqf0gn5g4/giphy.gif' },
    { id: 'snoopy_dance', url: 'https://i.giphy.com/media/AeWoyE3ZT90YM/giphy.gif' }, // REPLACED ok_hand

    // ROW 4: Party
    { id: 'panda_roll', url: 'https://i.giphy.com/media/EatwJZRUIv41G/giphy.gif' }, // REPLACED penguin_hi
    { id: 'party_cat', url: 'https://i.giphy.com/media/3o6fJ1BM7R2EBRDnxK/giphy.gif' },
    { id: 'cat_vibing', url: 'https://i.giphy.com/media/GeimqsH0TLDt4tScGw/giphy.gif' }, // REPLACED cool_dog
];

export default function EmojiPicker({ onEmojiSelect, onStickerSelect, onClose }) {
    const [activeTab, setActiveTab] = useState('emoji');
    const [stickers, setStickers] = useState(DEFAULT_STICKERS);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.trim().length > 0) {
                setIsLoading(true);
                try {
                    const response = await fetch(`https://api.giphy.com/v1/stickers/search?api_key=${GIPHY_API_KEY}&q=${searchQuery}&limit=15&rating=g`);
                    const data = await response.json();
                    if (data.data && data.data.length > 0) {
                        const formatted = data.data.map(item => ({
                            id: item.id,
                            url: item.images.fixed_height.url
                        }));
                        setStickers(formatted);
                    }
                } catch (error) {
                    console.error("Giphy fetch error:", error);
                    // Fallback handled by keeping existing state or showing error
                } finally {
                    setIsLoading(false);
                }
            } else {
                setStickers(DEFAULT_STICKERS);
            }
        }, 800);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    return (
        <div className="absolute bottom-16 left-4 z-50 w-[350px] bg-[#1a1a1a] border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-up">
            {/* Tabs */}
            <div className="flex border-b border-white/10 bg-[#111]">
                <button
                    onClick={() => setActiveTab('emoji')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'emoji' ? 'text-[#D4AF37] bg-[#D4AF37]/5 border-b-2 border-[#D4AF37]' : 'text-white/40 hover:text-white'}`}
                >
                    Emojis
                </button>
                <button
                    onClick={() => setActiveTab('sticker')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'sticker' ? 'text-[#D4AF37] bg-[#D4AF37]/5 border-b-2 border-[#D4AF37]' : 'text-white/40 hover:text-white'}`}
                >
                    Stickers
                </button>
                <button onClick={onClose} className="px-3 text-white/30 hover:text-white hover:bg-red-500/20">✕</button>
            </div>

            {/* Content */}
            <div className={`overflow-y-auto bg-[#1a1a1a] ${activeTab === 'emoji' ? 'h-[435px]' : 'h-64'}`}>
                {activeTab === 'emoji' && (
                    <div className="emoji-picker-custom">
                        <Picker
                            data={data}
                            onEmojiSelect={(e) => onEmojiSelect(e.native)}
                            theme="dark"
                            previewPosition="none"
                            skinTonePosition="none"
                            searchPosition="top"
                            navPosition="bottom"
                            perLine={8}
                        />
                    </div>
                )}

                {activeTab === 'sticker' && (
                    <div className="flex flex-col h-full">
                        <div className="px-2 pt-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search Giphy..."
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[#D4AF37] outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-2 p-2 pb-16 overflow-y-auto max-h-[220px]">
                            {isLoading ? (
                                <div className="col-span-3 flex justify-center py-4">
                                    <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                stickers.map((sticker) => (
                                    <button
                                        key={sticker.id}
                                        onClick={() => {
                                            console.log("Sticker selected:", sticker);
                                            onStickerSelect(sticker);
                                        }}
                                        className="aspect-square flex items-center justify-center hover:scale-105 transition-transform p-1 overflow-hidden relative min-h-[80px]"
                                    >
                                        <img
                                            src={sticker.url}
                                            alt="sticker"
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                console.error("Sticker load failed:", sticker.url);
                                                e.target.style.display = 'none';
                                                e.target.parentElement.innerText = '❌';
                                            }}
                                        />
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
