import React, { useState } from 'react';
import { X, Search, Plus, Phone, MessageSquare, Star, Mail, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { triggerHaptic } from '../../utils/haptics';

interface ContactsAppProps {
  onClose: () => void;
  onCallContact?: (number: string) => void;
  onMessageContact?: (number: string) => void;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  isFavorite?: boolean;
  avatarBg: string;
}

const INITIAL_CONTACTS: Contact[] = [
  { id: 'ct1', name: 'Alex Rivera', phone: '+1 (555) 876-5432', email: 'alex.rivera@example.com', isFavorite: true, avatarBg: 'bg-blue-600' },
  { id: 'ct2', name: 'David Chen', phone: '+1 (555) 345-9876', email: 'david.chen@example.com', isFavorite: true, avatarBg: 'bg-amber-600' },
  { id: 'ct3', name: 'Elena Rostova', phone: '+1 (555) 901-2345', email: 'elena.rostova@example.com', avatarBg: 'bg-purple-600' },
  { id: 'ct4', name: 'Marcus Johnson', phone: '+1 (555) 678-9012', email: 'marcus.j@example.com', avatarBg: 'bg-emerald-600' },
  { id: 'ct5', name: 'Sarah Connor', phone: '+1 (555) 234-5678', email: 'sarah.connor@example.com', isFavorite: true, avatarBg: 'bg-rose-600' },
  { id: 'ct6', name: 'Tech Support Helpdesk', phone: '+1 (800) 555-0199', email: 'support@magicos.com', avatarBg: 'bg-cyan-600' },
];

export const ContactsApp: React.FC<ContactsAppProps> = ({ onClose, onCallContact, onMessageContact }) => {
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const handleAddContact = () => {
    if (!newName.trim() || !newPhone.trim()) return;
    triggerHaptic('doubleTick');
    playTapSound(600);

    const colors = ['bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'bg-rose-600', 'bg-amber-600', 'bg-cyan-600'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newContact: Contact = {
      id: `ct-${Date.now()}`,
      name: newName.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim() || `${newName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      avatarBg: randomColor
    };

    setContacts(prev => [...prev, newContact].sort((a, b) => a.name.localeCompare(b.name)));
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setIsAdding(false);
  };

  const filtered = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col animate-in fade-in zoom-in-95 duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between p-3.5 bg-neutral-900 border-b border-neutral-800">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <span>Contacts</span>
          <span className="text-xs text-neutral-400 font-normal">({contacts.length})</span>
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('tick');
              setIsAdding(true);
            }}
            className="w-8 h-8 rounded-full bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold flex items-center justify-center shadow-md active:scale-95 transition-all"
            title="Create contact"
          >
            <Plus size={18} strokeWidth={2.8} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3 bg-neutral-900/60 border-b border-neutral-800/80">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-neutral-800 border border-neutral-700/60 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Main List */}
      <div className="flex-1 overflow-y-auto divide-y divide-neutral-900">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-neutral-500">
            No contacts found
          </div>
        ) : (
          filtered.map(contact => (
            <div
              key={contact.id}
              onClick={() => {
                triggerHaptic('tick');
                setSelectedContact(contact);
              }}
              className="flex items-center justify-between px-4 py-3 hover:bg-neutral-900/80 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${contact.avatarBg} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                  {contact.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{contact.name}</span>
                    {contact.isFavorite && <Star size={11} className="text-amber-400 fill-amber-400" />}
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-mono mt-0.5">{contact.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('tick');
                    if (onCallContact) onCallContact(contact.phone);
                  }}
                  className="p-2 rounded-full hover:bg-neutral-800 text-cyan-400"
                  title="Call"
                >
                  <Phone size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('tick');
                    if (onMessageContact) onMessageContact(contact.phone);
                  }}
                  className="p-2 rounded-full hover:bg-neutral-800 text-cyan-400"
                  title="Message"
                >
                  <MessageSquare size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Contact Details Modal */}
      {selectedContact && (
        <div 
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xl flex flex-col justify-end p-4 animate-in fade-in"
          onClick={() => setSelectedContact(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[380px] mx-auto bg-neutral-900 border border-neutral-700/80 rounded-[32px] p-5 flex flex-col items-center gap-3 shadow-2xl"
          >
            <div className={`w-16 h-16 rounded-full ${selectedContact.avatarBg} flex items-center justify-center text-white font-black text-2xl shadow-xl`}>
              {selectedContact.name.charAt(0)}
            </div>
            <h3 className="text-base font-bold text-white text-center">{selectedContact.name}</h3>
            <p className="text-xs text-neutral-400 font-mono">{selectedContact.phone}</p>
            <p className="text-[11px] text-neutral-500">{selectedContact.email}</p>

            <div className="flex items-center gap-3 w-full mt-2">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('tick');
                  if (onCallContact) onCallContact(selectedContact.phone);
                  setSelectedContact(null);
                }}
                className="flex-1 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md"
              >
                <Phone size={15} />
                <span>Call</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('tick');
                  if (onMessageContact) onMessageContact(selectedContact.phone);
                  setSelectedContact(null);
                }}
                className="flex-1 py-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-neutral-700"
              >
                <MessageSquare size={15} />
                <span>Message</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {isAdding && (
        <div 
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xl flex flex-col justify-center p-4 animate-in fade-in"
          onClick={() => setIsAdding(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[360px] mx-auto bg-neutral-900 border border-neutral-700/80 rounded-[28px] p-5 flex flex-col gap-3 shadow-2xl"
          >
            <h3 className="text-sm font-bold text-white">Create New Contact</h3>
            <input
              type="text"
              placeholder="Full Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-cyan-400"
            />
            <input
              type="tel"
              placeholder="Phone Number (e.g. +1 555-0123)"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-cyan-400"
            />
            <input
              type="email"
              placeholder="Email address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-cyan-400"
            />

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 py-2 rounded-xl bg-neutral-800 text-xs text-neutral-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddContact}
                disabled={!newName.trim() || !newPhone.trim()}
                className="flex-1 py-2 rounded-xl bg-cyan-500 disabled:opacity-50 text-neutral-950 font-bold text-xs"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
