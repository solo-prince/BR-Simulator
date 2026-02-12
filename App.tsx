
import React, { useState, useEffect } from 'react';
import { Trophy, Users, Sword, Box, Play, LayoutDashboard, ChevronRight, Zap, Target, Shield, Heart, Package, Map as MapIcon, RefreshCcw } from 'lucide-react';
import { CHARACTERS, WEAPONS, LOOT_ITEMS } from './constants';
import { Character, Weapon, PlayerLoadout, MatchEvent, LootItem } from './types';
import { simulateMatch } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lobby' | 'vault' | 'armory' | 'battle' | 'store' | 'scavenge'>('lobby');
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(CHARACTERS[0]);
  const [primaryWeapon, setPrimaryWeapon] = useState<Weapon>(WEAPONS[0]);
  const [secondaryWeapon, setSecondaryWeapon] = useState<Weapon>(WEAPONS[4]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [matchHistory, setMatchHistory] = useState<MatchEvent[]>([]);
  const [userCredits, setUserCredits] = useState(2500);
  const [inventory, setInventory] = useState<LootItem[]>([]);
  const [scavengedCount, setScavengedCount] = useState(0);

  const handleEnterScavenge = () => {
    setInventory([]);
    setScavengedCount(0);
    setActiveTab('scavenge');
  };

  const handleLoot = (item: LootItem) => {
    if (scavengedCount >= 5) return;
    setInventory(prev => [...prev, item]);
    setScavengedCount(prev => prev + 1);
  };

  const handleStartMatch = async () => {
    setActiveTab('battle');
    setIsSimulating(true);
    setMatchHistory([]);
    
    const events = await simulateMatch({
      character: selectedCharacter,
      primaryWeapon,
      secondaryWeapon,
      inventory
    });
    
    for (let i = 0; i < events.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMatchHistory(prev => [...prev, events[i]]);
    }
    
    setIsSimulating(false);
  };

  const renderScavengePhase = () => (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
        <div>
          <h2 className="font-orbitron text-3xl font-bold">SCAVENGE PHASE</h2>
          <p className="text-gray-500">Search the drops before the zone closes. ({scavengedCount}/5 items)</p>
        </div>
        {scavengedCount >= 3 && (
          <button 
            onClick={handleStartMatch}
            className="bg-green-600 px-6 py-3 rounded-xl font-bold hover:bg-green-500 transition animate-pulse flex items-center gap-2"
          >
            READY FOR BATTLE <Play size={18} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, idx) => {
          const item = LOOT_ITEMS[idx % LOOT_ITEMS.length];
          const isLooted = inventory.some(i => i.id === `${item.id}-${idx}`);
          
          return (
            <div 
              key={idx}
              onClick={() => {
                if (!isLooted && scavengedCount < 5) {
                   handleLoot({...item, id: `${item.id}-${idx}`});
                }
              }}
              className={`h-40 rounded-3xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                isLooted ? 'bg-zinc-800/50 border-zinc-700 opacity-50' : 
                scavengedCount >= 5 ? 'bg-zinc-900/20 border-zinc-800' :
                'bg-zinc-900 border-zinc-800 hover:border-orange-500 hover:scale-105'
              }`}
            >
              {isLooted ? <Package className="text-zinc-600" /> : <Box className="text-orange-500" />}
              <span className="text-[10px] font-bold tracking-widest uppercase">
                {isLooted ? 'EMPTY' : 'SUPPLY DROP'}
              </span>
            </div>
          );
        })}
      </div>

      <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800">
         <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Current Inventory</h3>
         <div className="flex flex-wrap gap-3">
            {inventory.length === 0 && <p className="text-zinc-700 italic text-sm">Nothing looted yet...</p>}
            {inventory.map((item, idx) => (
              <div key={idx} className={`px-4 py-2 rounded-xl text-xs font-bold border ${
                item.rarity === 'legendary' ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500' :
                item.rarity === 'epic' ? 'border-purple-500 bg-purple-500/10 text-purple-500' :
                'border-zinc-700 bg-zinc-800 text-zinc-300'
              }`}>
                {item.name.toUpperCase()}
              </div>
            ))}
         </div>
      </div>
    </div>
  );

  const renderLobby = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 blur-[100px] -z-10 rounded-full"></div>
      
      <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl w-full px-6">
        <div className="relative group flex-1">
          <img 
            src={selectedCharacter.image} 
            className="w-full max-w-sm rounded-3xl border-4 border-red-500 shadow-2xl transition-transform duration-500 group-hover:scale-105"
            alt={selectedCharacter.name}
          />
          <div className="absolute -bottom-6 -left-6 bg-red-600 p-4 rounded-xl shadow-xl">
             <h3 className="font-orbitron font-bold text-xl">{selectedCharacter.name}</h3>
             <p className="text-xs text-red-100 uppercase tracking-widest">{selectedCharacter.ability}</p>
          </div>
        </div>

        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <h1 className="font-orbitron text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
              IGNITE
            </h1>
            <p className="text-gray-400 text-lg">Prepare for survival. Choose your legend, arm yourself, and dominate the battleground.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 flex items-center gap-4">
                <div className="bg-red-500/10 p-2 rounded-lg"><Zap className="text-red-500" /></div>
                <div className="truncate">
                   <p className="text-xs text-gray-500 uppercase">Primary</p>
                   <p className="font-semibold truncate">{primaryWeapon.name}</p>
                </div>
             </div>
             <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 flex items-center gap-4">
                <div className="bg-orange-500/10 p-2 rounded-lg"><Target className="text-orange-500" /></div>
                <div className="truncate">
                   <p className="text-xs text-gray-500 uppercase">Secondary</p>
                   <p className="font-semibold truncate">{secondaryWeapon.name}</p>
                </div>
             </div>
          </div>

          <button 
            onClick={handleEnterScavenge}
            className="w-full md:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-orbitron font-bold text-2xl py-6 px-12 rounded-2xl shadow-2xl shadow-red-600/30 transform transition active:scale-95 flex items-center justify-center gap-4 group"
          >
            ENTER MATCH
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderVault = () => (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-fadeIn">
      <h2 className="font-orbitron text-4xl font-bold">THE VAULT</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {CHARACTERS.map(char => (
          <div 
            key={char.id}
            onClick={() => setSelectedCharacter(char)}
            className={`cursor-pointer group relative overflow-hidden rounded-3xl border-2 transition-all duration-300 ${selectedCharacter.id === char.id ? 'border-red-500 ring-4 ring-red-500/20' : 'border-zinc-800 hover:border-zinc-600'}`}
          >
            <img src={char.image} className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700" alt={char.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <div className="absolute bottom-0 p-4 w-full bg-black/60 backdrop-blur-sm">
              <h3 className="font-orbitron font-bold text-xl">{char.name}</h3>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">{char.ability}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderArmory = () => (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-fadeIn">
      <h2 className="font-orbitron text-4xl font-bold uppercase">ARMORY</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {WEAPONS.map(weapon => (
          <div 
            key={weapon.id}
            className={`bg-zinc-900 border-2 p-6 rounded-3xl transition-all duration-300 ${primaryWeapon.id === weapon.id ? 'border-red-500 shadow-lg shadow-red-500/10' : secondaryWeapon.id === weapon.id ? 'border-orange-500 shadow-lg shadow-orange-500/10' : 'border-zinc-800'}`}
          >
            <img src={weapon.image} className="w-full h-32 object-contain mb-4" alt={weapon.name} />
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-orbitron font-bold text-lg">{weapon.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 bg-zinc-800 rounded-full text-zinc-400 uppercase tracking-widest">{weapon.category}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {[
                  { label: 'Damage', val: weapon.damage, color: 'bg-red-500' },
                  { label: 'Fire Rate', val: weapon.rateOfFire, color: 'bg-blue-500' },
                  { label: 'Reload', val: weapon.reloadSpeed, color: 'bg-green-500' },
                  { label: 'Range', val: weapon.range, color: 'bg-yellow-500' }
                ].map(stat => (
                  <div key={stat.label} className="space-y-1">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500">
                      <span>{stat.label}</span>
                      <span>{stat.val}</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-800 rounded-full">
                      <div className={`${stat.color} h-full rounded-full transition-all duration-500`} style={{ width: `${stat.val}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => setPrimaryWeapon(weapon)}
                  className={`flex-1 text-xs py-2 rounded-xl font-bold transition ${primaryWeapon.id === weapon.id ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                >
                  SET PRIMARY
                </button>
                <button 
                  onClick={() => setSecondaryWeapon(weapon)}
                  className={`flex-1 text-xs py-2 rounded-xl font-bold transition ${secondaryWeapon.id === weapon.id ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                >
                  SET SECONDARY
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBattle = () => (
    <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-6 min-h-[80vh]">
       {/* Sidebar Inventory */}
       <div className="w-full md:w-64 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
             <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Package size={14} /> Inventory
             </h4>
             <div className="space-y-2">
                {inventory.map((item, i) => (
                  <div key={i} className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex justify-between items-center text-[10px] font-bold">
                    <span className="truncate pr-2">{item.name.toUpperCase()}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      item.rarity === 'legendary' ? 'bg-yellow-500' :
                      item.rarity === 'epic' ? 'bg-purple-500' : 'bg-zinc-600'
                    }`}></span>
                  </div>
                ))}
                {inventory.length === 0 && <p className="text-zinc-700 italic text-xs">No items found.</p>}
             </div>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
             <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Shield size={14} /> Armor
             </h4>
             <div className="flex gap-1">
                {[1,2,3].map(lvl => (
                   <div key={lvl} className={`flex-1 h-2 rounded-full ${inventory.some(i => i.name.includes(`Level ${lvl}`)) ? 'bg-blue-500' : 'bg-zinc-800'}`}></div>
                ))}
             </div>
          </div>
       </div>

       {/* Battle Feed */}
       <div className="flex-1 bg-zinc-900 border-2 border-zinc-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
          <div className="bg-zinc-950 p-6 border-b border-zinc-800 flex justify-between items-center">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-red-500 p-0.5">
                   <img src={selectedCharacter.image} className="w-full h-full rounded-full object-cover" alt="char" />
                </div>
                <div>
                   <h3 className="font-orbitron font-bold uppercase">{selectedCharacter.name}</h3>
                   <p className="text-[10px] text-gray-500 uppercase tracking-widest">Zone: Shrinking</p>
                </div>
             </div>
             <div className="text-right">
                <p className="font-orbitron text-red-500 text-xl font-bold">ALIVE</p>
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                   <Users size={12} /> 12 Left
                </div>
             </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-4 font-mono text-sm max-h-[600px]">
             {matchHistory.length === 0 && isSimulating && (
               <div className="flex flex-col items-center justify-center h-full gap-4 text-zinc-500 italic">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                  Simulating deployment strategy...
               </div>
             )}
             
             {matchHistory.map((event, i) => (
               <div key={i} className={`flex gap-4 p-4 rounded-xl animate-slideIn ${
                 event.type === 'kill' ? 'bg-red-500/10 border border-red-500/20' :
                 event.type === 'zone' ? 'bg-blue-500/10 border border-blue-500/20' :
                 event.type === 'danger' ? 'bg-orange-500/10 border border-orange-500/20' :
                 event.type === 'loot' ? 'bg-green-500/10 border border-green-500/20' :
                 'bg-zinc-800/50'
               }`}>
                  <span className="text-gray-500 font-bold whitespace-nowrap">[{event.time}]</span>
                  <p className="text-zinc-300">{event.message}</p>
               </div>
             ))}
             
             {!isSimulating && matchHistory.length > 0 && (
               <div className="p-8 bg-zinc-950 border-2 border-red-500/30 rounded-3xl text-center space-y-4 mt-8 animate-bounce">
                  <Trophy className="mx-auto text-yellow-500" size={64} />
                  <h2 className="font-orbitron text-3xl font-black text-white italic">BOOYAH!</h2>
                  <p className="text-zinc-400">Survival successful. Rank points +45.</p>
                  <button 
                    onClick={() => setActiveTab('lobby')}
                    className="bg-red-600 px-6 py-2 rounded-lg font-bold hover:bg-red-500 transition"
                  >
                    RETURN TO LOBBY
                  </button>
               </div>
             )}
          </div>
       </div>
    </div>
  );

  const renderStore = () => (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-fadeIn">
       <div className="flex justify-between items-center bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
          <div>
            <h2 className="font-orbitron text-4xl font-bold uppercase tracking-tighter">LOOT STORE</h2>
            <p className="text-gray-500 italic">Unlock legendary weapon skins and rare bundles</p>
          </div>
          <div className="bg-zinc-950 px-6 py-3 rounded-2xl border border-zinc-800 flex items-center gap-3">
             <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50"></div>
             <span className="font-orbitron font-bold text-xl">{userCredits.toLocaleString()}</span>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'CHRONO CRATE', price: 500, color: 'border-blue-500', icon: Box },
            { name: 'VENOM CRATE', price: 1200, color: 'border-green-500', icon: Sword },
            { name: 'LEGENDARY BUNDLE', price: 5000, color: 'border-red-500', icon: Trophy },
          ].map((item, idx) => (
            <div key={idx} className={`bg-zinc-900 border-2 ${item.color} p-8 rounded-3xl flex flex-col items-center gap-6 group hover:-translate-y-2 transition-transform duration-300`}>
               <div className={`p-8 rounded-full bg-zinc-950 border border-zinc-800 shadow-2xl group-hover:scale-110 transition-transform`}>
                  <item.icon size={64} className="text-zinc-200" />
               </div>
               <div className="text-center">
                  <h3 className="font-orbitron font-bold text-xl">{item.name}</h3>
                  <p className="text-zinc-500 text-sm mt-1">Guaranteed Rare or higher</p>
               </div>
               <button 
                onClick={() => {
                  if(userCredits >= item.price) {
                    setUserCredits(prev => prev - item.price);
                    alert("Crate opened! You received a new weapon skin.");
                  } else {
                    alert("Insufficient credits!");
                  }
                }}
                className="w-full py-4 rounded-2xl bg-zinc-950 font-bold hover:bg-white hover:text-black transition flex items-center justify-center gap-2"
               >
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  {item.price} OPEN
               </button>
            </div>
          ))}
       </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <nav className="p-6 bg-transparent flex justify-between items-center max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('lobby')}>
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/50">
             <Sword className="text-white" size={24} />
          </div>
          <span className="font-orbitron text-2xl font-black italic tracking-tighter">IGNITE</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 bg-zinc-900/50 backdrop-blur-md px-8 py-3 rounded-2xl border border-zinc-800 shadow-xl">
           <button onClick={() => setActiveTab('lobby')} className={`text-xs font-bold transition ${activeTab === 'lobby' ? 'text-red-500' : 'text-zinc-500 hover:text-white'}`}>LOBBY</button>
           <button onClick={() => setActiveTab('vault')} className={`text-xs font-bold transition ${activeTab === 'vault' ? 'text-red-500' : 'text-zinc-500 hover:text-white'}`}>VAULT</button>
           <button onClick={() => setActiveTab('armory')} className={`text-xs font-bold transition ${activeTab === 'armory' ? 'text-red-500' : 'text-zinc-500 hover:text-white'}`}>ARMORY</button>
           <button onClick={() => setActiveTab('store')} className={`text-xs font-bold transition ${activeTab === 'store' ? 'text-red-500' : 'text-zinc-500 hover:text-white'}`}>STORE</button>
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden sm:flex bg-zinc-900/50 px-4 py-2 rounded-xl border border-zinc-800 gap-2 items-center">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              <span className="font-bold text-sm">{userCredits}</span>
           </div>
           <div className="w-10 h-10 rounded-full border-2 border-red-500 p-0.5 overflow-hidden">
              <img src="https://picsum.photos/seed/profile/100" className="w-full h-full rounded-full" alt="profile" />
           </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-0">
        {activeTab === 'lobby' && renderLobby()}
        {activeTab === 'vault' && renderVault()}
        {activeTab === 'armory' && renderArmory()}
        {activeTab === 'scavenge' && renderScavengePhase()}
        {activeTab === 'battle' && renderBattle()}
        {activeTab === 'store' && renderStore()}
      </main>

      {/* Mobile Footer Nav */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:hidden bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-4 flex justify-around items-center shadow-2xl z-50">
        <button onClick={() => setActiveTab('lobby')} className={`p-3 rounded-2xl transition ${activeTab === 'lobby' ? 'bg-red-600 text-white' : 'text-zinc-500'}`}>
          <LayoutDashboard size={24} />
        </button>
        <button onClick={() => setActiveTab('vault')} className={`p-3 rounded-2xl transition ${activeTab === 'vault' ? 'bg-red-600 text-white' : 'text-zinc-500'}`}>
          <Users size={24} />
        </button>
        <button onClick={() => setActiveTab('armory')} className={`p-3 rounded-2xl transition ${activeTab === 'armory' ? 'bg-red-600 text-white' : 'text-zinc-500'}`}>
          <Shield size={24} />
        </button>
        <button onClick={() => setActiveTab('store')} className={`p-3 rounded-2xl transition ${activeTab === 'store' ? 'bg-red-600 text-white' : 'text-zinc-500'}`}>
          <Box size={24} />
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default App;
