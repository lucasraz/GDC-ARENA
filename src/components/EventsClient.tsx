'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, MapPin, Clock, Users, X, DollarSign, Trash2, Beer, Home, Info, UserCheck, UserPlus, MessageCircle, CheckCircle2, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { joinEvent, leaveEvent, deleteEvent, saveEvent, togglePaymentStatus } from '@/app/actions/event_actions'
import EventEditor from './EventEditor'

export default function EventsClient({ userId, tenantId, initialEvents }: any) {
  const router = useRouter()
  // No more local state for events, use props directly to allow router.refresh()
  const [isAdding, setIsAdding] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  
  const [selectedBeers, setSelectedBeers] = useState<Record<string, string>>({})
  const [guestInputs, setGuestInputs] = useState<Record<string, { name: string, beer: string, isAdding: boolean }>>({})

  // UI mapping
  const events = initialEvents


  const handleJoin = async (eventId: string, guestName?: string, beer?: string) => {
    if (!userId) {
      router.push('/login')
      return
    }
    const finalBeer = beer || selectedBeers[eventId] || 'nenhuma'
    const result = await joinEvent(eventId, userId, finalBeer, guestName)
    if (result.success) {
      router.refresh()
      if (guestName) setGuestInputs({ ...guestInputs, [eventId]: { name: '', beer: 'nenhuma', isAdding: false } })
    } else {
      alert(result.error)
    }
  }

  const handleLeave = async (attendanceId: string) => {
    const result = await leaveEvent(attendanceId, userId)
    if (result.success) {
      router.refresh()
    } else {
      alert(result.error)
    }
  }

  const handleTogglePayment = async (attendeeUserId: string, isPaid: boolean, event: any, hostProfile: any, personalRecords: any[]) => {
    const result = await togglePaymentStatus(event.id, attendeeUserId, isPaid, userId)
    if (result.success) {
      router.refresh()
    } else {
        alert(result.error || 'Erro ao processar quitação.')
    }
  }



  const sendWhatsAppMessage = (event: any, hostProfile: any, personalRecords: any[], isPaid: boolean, amount: number) => {
      // Handle both object and array response from Supabase
      const profileData = Array.isArray(hostProfile) ? hostProfile[0] : hostProfile
      const phone = profileData?.whatsapp || profileData?.phone
      
      if (!phone) {
          alert(`Telefone/WhatsApp não encontrado para ${profileData?.full_name || 'este usuário'}. Verifique se ele preencheu o campo no perfil.`)
          return
      }

      let msg = ''
      if (isPaid) {
          const guestList = personalRecords.filter(r => r.guest_name).map(r => r.guest_name).join(', ') || 'Apenas você'
          const beersList = [...new Set(personalRecords.map(r => r.selected_beer.toUpperCase()))].join(', ')
          msg = `Olá ${profileData.full_name}! ✅ Confirmamos sua quitação para o evento *${event.title}*.\n\n📅 Data: ${new Date(event.event_time).toLocaleDateString('pt-BR')}\n👥 Convidados: ${guestList}\n📍 Local: ${event.location}\n🍺 Cervejas: ${beersList}\n⏰ Horário: ${new Date(event.event_time).toLocaleTimeString('pt-BR')}\n\nAgradecemos sua participação!\nEquipe GDC.`
      } else {
          msg = `Olá ${profileData.full_name}! 👋 Sou o organizador do evento *${event.title}*. Segue lembrete de pagamento pendente de *R$ ${amount.toFixed(2)}* para você e seus convidados. Favor desconsiderar se já foi pago. Equipe GDC.`
      }
      
      window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const handleDeleteEvent = async (id: string) => {
    setIsDeleting(id)
    const result = await deleteEvent(id, userId)
    if (result.success) {
      router.refresh()
    }
    setIsDeleting(null)
  }

  const handleSaveEvent = async (data: any) => {
    const result = await saveEvent(userId, tenantId, data)
    if (result.success) {
      router.refresh()
      setIsAdding(false)
      return { success: true }
    }
    return result
  }


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      
      {userId && (
         <button 
           onClick={() => setIsAdding(!isAdding)} 
           className="btn-primary" 
           style={{ 
               alignSelf: 'flex-start', 
               display: 'flex', 
               alignItems: 'center', 
               gap: '0.75rem', 
               padding: '1.25rem 2rem',
               background: isAdding ? 'transparent' : 'var(--primary)',
               border: isAdding ? '1px solid var(--primary)' : 'none',
               color: isAdding ? 'var(--primary)' : 'black'
           }}
         >
           {isAdding ? <X size={20} /> : <Plus size={20} />}
           {isAdding ? 'FECHAR FORMULÁRIO' : 'ORGANIZAR EVENTO'}
         </button>
      )}

      <AnimatePresence mode="wait">
        {isAdding && (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card"
                style={{ padding: '3rem' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>NOVO EVENTO GDC</h3>
                    <button onClick={() => setIsAdding(false)} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>
                <EventEditor onSubmit={handleSaveEvent} onCancel={() => setIsAdding(false)} />
            </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of Events */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        {events.map((event: any) => {
              const myAttendanceRecords = event.attendees?.filter((a: any) => a.user_id === userId) || []
              const isConfirmed = myAttendanceRecords.some((a: any) => !a.guest_name)
              const attendeeCount = event.attendees?.length || 0
              
              const beerCounts: Record<string, number> = { 'heineken': 0, 'brahma': 0, 'antarctica': 0, 'stella': 0, 'nenhuma': 0 }
              event.attendees?.forEach((a: any) => {
                  const b = a.selected_beer?.toLowerCase() || 'nenhuma'
                  if (beerCounts[b] !== undefined) beerCounts[b]++
              })

              const availableBeers: { id: string, name: string, price: number }[] = []
              if (event.beer_price_heineken > 0) availableBeers.push({ id: 'heineken', name: 'HEINEKEN', price: event.beer_price_heineken })
              if (event.beer_price_stella > 0) availableBeers.push({ id: 'stella', name: 'STELLA', price: event.beer_price_stella })
              if (event.beer_price_brahma > 0) availableBeers.push({ id: 'brahma', name: 'BRAHMA', price: event.beer_price_brahma })
              if (event.beer_price_antarctica > 0) availableBeers.push({ id: 'antarctica', name: 'ANTARCTICA', price: event.beer_price_antarctica })

              const myUnpaidRecords = myAttendanceRecords.filter((a: any) => !a.is_paid)
              const myUnpaidBill = myUnpaidRecords.reduce((total: number, a: any) => {
                  const beerPrice = availableBeers.find(b => b.id === a.selected_beer)?.price || 0
                  return total + event.price + beerPrice
              }, 0)
              const isMyGroupFullyPaid = myAttendanceRecords.length > 0 && myAttendanceRecords.every((a: any) => a.is_paid)

              // Group by User for the Organizer
              const groupedAttendees: Record<string, { profile: any, records: any[], totalPending: number }> = {}
              event.attendees?.forEach((a: any) => {
                  if (!groupedAttendees[a.user_id]) groupedAttendees[a.user_id] = { profile: a.profiles, records: [], totalPending: 0 }
                  groupedAttendees[a.user_id].records.push(a)
                  if (!a.is_paid) {
                      const bp = availableBeers.find(b => b.id === a.selected_beer)?.price || 0
                      groupedAttendees[a.user_id].totalPending += (event.price + bp)
                  }
              })


              return (
                <motion.div 
                  layout 
                  key={event.id} 
                  className="card" 
                  style={{ 
                    padding: 'clamp(1rem, 5vw, 2.5rem)', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '2rem' 
                  }}
                >
                    {/* Event Grid Container - Stacks on Mobile */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', 
                        gap: '2.5rem' 
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                                 <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <span className="label" style={{ background: 'var(--primary)', color: 'black', padding: '0.2rem 0.6rem' }}>GDC ARENA</span>
                                    {(event.attendees?.filter((r: any) => !r.is_paid).reduce((sum: number, r: any) => {
                                        const bp = availableBeers.find(b => b.id === r.selected_beer)?.price || 0
                                        return sum + event.price + bp
                                    }, 0) > 0) && (
                                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#E57373', background: 'rgba(229, 115, 115, 0.1)', padding: '0.25rem 0.6rem', borderRadius: '4px', border: '1px solid rgba(229, 115, 115, 0.2)' }}>
                                            PÈNDENTE: R$ {event.attendees?.filter((r: any) => !r.is_paid).reduce((sum: number, r: any) => {
                                                const bp = availableBeers.find(b => b.id === r.selected_beer)?.price || 0
                                                return sum + event.price + bp
                                            }, 0).toFixed(2)}
                                        </span>
                                    )}
                                 </div>
                                 {userId === event.author_id && <Trash2 size={20} onClick={() => handleDeleteEvent(event.id)} style={{ color: isDeleting === event.id ? 'var(--outline-variant)' : '#E57373', cursor: 'pointer', flexShrink: 0 }} />}
                            </div>

                            <div style={{ minWidth: 0 }}>
                                <h3 style={{ fontSize: 'clamp(1.5rem, 6vw, 2.5rem)', fontWeight: 900, marginBottom: '0.5rem', wordWrap: 'break-word' }}>{event.title}</h3>
                                <p style={{ opacity: 0.7, fontSize: '0.95rem' }}>{event.description}</p>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem', fontWeight: 700, flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><MapPin size={16} /> {event.location}</div>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><Clock size={16} /> {new Date(event.event_time).toLocaleString('pt-BR')}</div>
                            </div>

                            {/* BEER SUMMARY */}
                            <div style={{ background: 'var(--surface-container-low)', padding: '1.25rem', borderRadius: '4px' }}>
                                 <p className="label" style={{ marginBottom: '1rem', fontSize: '0.6rem', opacity: 0.6 }}>RESUMO DE CONSUMO</p>
                                 <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    {Object.entries(beerCounts).map(([beer, count]) => {
                                        if (count === 0 && (beer === 'nenhuma' || beer === 'none')) return null
                                        return (
                                            <div key={beer} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <Beer size={14} style={{ color: 'var(--primary)' }} />
                                                <span style={{ fontSize: '0.75rem', fontWeight: 900 }}>{count} {beer.toUpperCase()}</span>
                                            </div>
                                        )
                                    })}
                                 </div>
                            </div>
                        </div>

                        {/* PERSONAL RSVP COLUMN */}
                        <div style={{ 
                            background: 'var(--surface-container-high)', 
                            padding: 'clamp(1.25rem, 4vw, 2rem)', 
                            borderRadius: '8px', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '1.5rem',
                            minWidth: 0 
                        }}>
                            {isConfirmed && (
                                <div style={{ borderBottom: '1px solid var(--outline-variant)', paddingBottom: '1rem' }}>
                                    <p className="label" style={{ fontSize: '0.6rem', marginBottom: '1rem', opacity: 0.5 }}>MINHA RESERVA</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                        {myAttendanceRecords.map((r: any) => {
                                            const bp = availableBeers.find(b => b.id === r.selected_beer)?.price || 0
                                            return (
                                                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', gap: '0.5rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                                                        <Trash2 
                                                            size={14} 
                                                            onClick={(e) => { e.stopPropagation(); handleLeave(r.id); }} 
                                                            style={{ 
                                                                color: '#E57373', 
                                                                cursor: 'pointer',
                                                                opacity: r.is_paid ? 0.3 : 0.8,
                                                                flexShrink: 0
                                                            }} 
                                                        />
                                                        <span style={{ fontWeight: 600, opacity: r.is_paid ? 0.4 : 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {r.guest_name || 'VOCÊ'} <small style={{ fontWeight: 400, fontSize: '0.65rem' }}>({r.selected_beer.toUpperCase()})</small>
                                                        </span>
                                                    </div>
                                                    <span style={{ fontWeight: 900, color: r.is_paid ? '#81C784' : 'inherit', fontSize: '0.7rem', flexShrink: 0 }}>
                                                        {r.is_paid ? 'PAGO ✓' : `R$ ${(event.price + bp).toFixed(2)}`}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            <div>
                                 <p className="label" style={{ fontSize: '0.65rem', opacity: 0.5 }}>{isMyGroupFullyPaid ? 'SITUAÇÃO' : 'VALOR A PAGAR'}</p>
                                 <h4 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 900, color: isMyGroupFullyPaid ? '#81C784' : 'inherit' }}>
                                    {isMyGroupFullyPaid ? 'QUITADO' : `R$ ${myUnpaidBill.toFixed(2)}`}
                                 </h4>
                            </div>

                            {!userId ? (
                                <button onClick={() => router.push('/login')} className="btn-primary">LOGAR PARA PARTICIPAR</button>
                            ) : !isConfirmed ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <select className="input-field" style={{ fontSize: '0.85rem' }} value={selectedBeers[event.id] || 'nenhuma'} onChange={(e) => setSelectedBeers({...selectedBeers, [event.id]: e.target.value})}>
                                        <option value="nenhuma">NÃO VOU BEBER</option>
                                        {availableBeers.map(b => <option key={b.id} value={b.id}>{b.name.toUpperCase()} (+R$ {b.price.toFixed(2)})</option>)}
                                    </select>
                                    <button onClick={() => handleJoin(event.id)} className="btn-primary" style={{ padding: '0.9rem' }}>CONFIRMAR PRESENÇA</button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {!isMyGroupFullyPaid && (
                                        <div style={{ textAlign: 'center', padding: '0.75rem', background: 'rgba(229, 115, 115, 0.1)', borderRadius: '4px', border: '1px solid rgba(229, 115, 115, 0.2)' }}>
                                             <p style={{ color: '#E57373', fontWeight: 900, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                                                <AlertCircle size={14}/> AGUARDANDO QUITAÇÃO
                                             </p>
                                        </div>
                                    )}
                                    
                                    <button onClick={() => setGuestInputs({...guestInputs, [event.id]: { name: '', beer: 'nenhuma', isAdding: true }})} className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '0.8rem' }}>+ CONVIDADO</button>
                                    
                                    {guestInputs[event.id]?.isAdding && (
                                        <div style={{ padding: '1rem', background: 'var(--surface-container-low)', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <input className="input-field" style={{ fontSize: '0.85rem' }} placeholder="Nome do Convidado" value={guestInputs[event.id].name} onChange={(e) => setGuestInputs({...guestInputs, [event.id]: {...guestInputs[event.id], name: e.target.value}})} />
                                            <select className="input-field" style={{ fontSize: '0.85rem' }} value={guestInputs[event.id].beer} onChange={(e) => setGuestInputs({...guestInputs, [event.id]: {...guestInputs[event.id], beer: e.target.value}})}>
                                                <option value="nenhuma">SEM BEBIDA</option>
                                                {availableBeers.map(b => <option key={b.id} value={b.id}>{b.name.toUpperCase()}</option>)}
                                            </select>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => handleJoin(event.id, guestInputs[event.id].name, guestInputs[event.id].beer)} className="btn-primary" style={{ fontSize: '0.7rem', flex: 1, padding: '0.6rem' }}>ADICIONAR</button>
                                                <button onClick={() => setGuestInputs({...guestInputs, [event.id]: { name: '', beer: 'nenhuma', isAdding: false }})} className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--outline)', color: 'inherit', padding: '0.5rem', width: '40px' }}><X size={16}/></button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ORGANIZER VIEW: PAYMENT CONTROL - Full Width Stack */}
                    {userId === event.author_id && (
                        <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '2rem' }}>
                            <h4 style={{ fontSize: '0.75rem', fontWeight: 900, marginBottom: '1.25rem', opacity: 0.6 }}>CONTROLE DE QUITAÇÃO</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {Object.entries(groupedAttendees).map(([attendeeUserId, group]: [string, any]) => {
                                    const isAllPaid = group.records.every((r: any) => r.is_paid)
                                    return (
                                        <div key={`${event.id}-${attendeeUserId}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem', background: 'var(--surface-container-high)', borderRadius: '4px', gap: '1rem', flexWrap: 'wrap' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: '150px' }}>
                                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--surface)', overflow: 'hidden', flexShrink: 0 }}>
                                                    {group.profile.avatar_url && <img src={group.profile.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                                </div>
                                                <div style={{ minWidth: 0 }}>
                                                    <p style={{ fontWeight: 900, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{group.profile.full_name}</p>
                                                    <p style={{ fontSize: '0.7rem', fontWeight: 600, color: group.totalPending > 0 ? '#E57373' : '#81C784' }}>
                                                        {group.totalPending > 0 ? `R$ ${group.totalPending.toFixed(2)}` : 'PAGO ✓'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginLeft: 'auto' }}>
                                                <button 
                                                    onClick={() => handleTogglePayment(attendeeUserId, !isAllPaid, event, group.profile, group.records)}
                                                    style={{ 
                                                        background: isAllPaid ? 'transparent' : 'var(--primary)', 
                                                        border: isAllPaid ? '1px solid var(--primary)' : 'none', 
                                                        color: isAllPaid ? 'var(--primary)' : 'black', 
                                                        padding: '0 1rem', 
                                                        borderRadius: '4px', 
                                                        fontSize: '0.7rem', 
                                                        fontWeight: 900, 
                                                        cursor: 'pointer',
                                                        height: '34px',
                                                        minWidth: '70px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    {isAllPaid ? 'VER' : 'QUITAR'}
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); sendWhatsAppMessage(event, group.profile, group.records, isAllPaid, group.totalPending); }}
                                                    className="btn-whatsapp"
                                                    style={{ 
                                                        background: isAllPaid ? '#4A90E2' : '#25D366', 
                                                        color: 'white', 
                                                        border: 'none', 
                                                        padding: '0.4rem', 
                                                        borderRadius: '6px', 
                                                        cursor: 'pointer',
                                                        width: '34px',
                                                        height: '34px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <img src="/icons/whatsapp-icon.png" alt="W" style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </motion.div>


              )
        })}
      </div>
    </div>
  )
}
