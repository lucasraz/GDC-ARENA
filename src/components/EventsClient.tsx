'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, MapPin, Clock, Users, X, DollarSign, Trash2, Beer, Home, Info, UserCheck, UserPlus, MessageCircle, CheckCircle2, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { joinEvent, leaveEvent, deleteEvent, saveEvent, togglePaymentStatus } from '@/app/actions/event_actions'
import EventEditor from './EventEditor'

export default function EventsClient({ userId, tenantId, initialEvents }: any) {
  const router = useRouter()
  const [events, setEvents] = useState(initialEvents)
  const [isAdding, setIsAdding] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  
  const [selectedBeers, setSelectedBeers] = useState<Record<string, string>>({})
  const [guestInputs, setGuestInputs] = useState<Record<string, { name: string, beer: string, isAdding: boolean }>>({})

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

  const handleTogglePayment = async (attendanceId: string, isPaid: boolean, event: any, hostProfile: any, personalRecords: any[]) => {
    const result = await togglePaymentStatus(attendanceId, isPaid, userId)
    if (result.success) {
      if (isPaid) {
          // Send Confirmation WhatsApp
          const phone = hostProfile?.phone
          if (phone) {
              const guestList = personalRecords.filter(r => r.guest_name).map(r => r.guest_name).join(', ') || 'Apenas você'
              const beersList = personalRecords.map(r => r.selected_beer.toUpperCase()).join(', ')
              const msg = `Olá ${hostProfile.full_name}! ✅ Confirmamos sua quitação para o evento *${event.title}*.\n\n📅 Data: ${new Date(event.event_time).toLocaleDateString('pt-BR')}\n👥 Convidados: ${guestList}\n📍 Local: ${event.location}\n🍺 Cervejas: ${beersList}\n⏰ Horário: ${new Date(event.event_time).toLocaleTimeString('pt-BR')}\n\nAgradecemos sua participação!\nEquipe GDC.`
              window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank')
          }
      }
      router.refresh()
    }
  }

  const sendReminder = (event: any, hostProfile: any, amount: number) => {
      const phone = hostProfile?.phone
      if (!phone) {
          alert('Este usuário não possui telefone cadastrado no perfil.')
          return
      }
      const msg = `Olá ${hostProfile.full_name}! 👋 Sou o organizador do evento *${event.title}*. Segue lembrete de pagamento pendente de *R$ ${amount.toFixed(2)}* para você e seus convidados. Favor desconsiderar se já foi pago. Equipe GDC.`
      window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank')
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

              const myBill = myAttendanceRecords.reduce((total: number, a: any) => {
                  const beerPrice = availableBeers.find(b => b.id === a.selected_beer)?.price || 0
                  return total + event.price + beerPrice
              }, 0)

              // Group by User for the Organizer
              const groupedAttendees: Record<string, { profile: any, records: any[], total: number }> = {}
              event.attendees?.forEach((a: any) => {
                  if (!groupedAttendees[a.user_id]) groupedAttendees[a.user_id] = { profile: a.profiles, records: [], total: 0 }
                  groupedAttendees[a.user_id].records.push(a)
                  const bp = availableBeers.find(b => b.id === a.selected_beer)?.price || 0
                  groupedAttendees[a.user_id].total += (event.price + bp)
              })

              return (
                <motion.div layout key={event.id} className="card" style={{ padding: '3rem', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '4rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                             <span className="label" style={{ background: 'var(--primary)', color: 'black', padding: '0.2rem 0.6rem' }}>GIGANTE ARENA</span>
                             {userId === event.author_id && <Trash2 size={20} onClick={() => deleteEvent(event.id, userId)} style={{ color: '#E57373', cursor: 'pointer' }} />}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>{event.title}</h3>
                            <p style={{ opacity: 0.7 }}>{event.description}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', fontWeight: 700 }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}><MapPin size={18} /> {event.location}</div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}><Clock size={18} /> {new Date(event.event_time).toLocaleString('pt-BR')}</div>
                        </div>

                        {/* BEER SUMMARY - RESTORED */}
                        <div style={{ background: 'var(--surface-container-low)', padding: '1.5rem', borderRadius: '4px' }}>
                             <p className="label" style={{ marginBottom: '1rem', fontSize: '0.65rem' }}>RESUMO DE CONSUMO</p>
                             <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                                {Object.entries(beerCounts).map(([beer, count]) => {
                                    if (count === 0 && (beer === 'nenhuma' || beer === 'none')) return null
                                    return (
                                        <div key={beer} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Beer size={16} style={{ color: 'var(--primary)' }} />
                                            <span style={{ fontSize: '0.8rem', fontWeight: 900 }}>{count} {beer.toUpperCase()}</span>
                                        </div>
                                    )
                                })}
                             </div>
                        </div>

                        {/* ORGANIZER VIEW: PAYMENT CONTROL */}
                        {userId === event.author_id && (
                            <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '2rem' }}>
                                <h4 style={{ fontSize: '0.8rem', fontWeight: 900, marginBottom: '1.5rem' }}>CONTROLE DE QUITAÇÃO</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {Object.values(groupedAttendees).map((group: any) => {
                                        const isAllPaid = group.records.every((r: any) => r.is_paid)
                                        return (
                                            <div key={group.profile.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--surface-container-high)', borderRadius: '4px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface)', overflow: 'hidden' }}>
                                                        {group.profile.avatar_url && <img src={group.profile.avatar_url} style={{ width: '100%', height: '100%' }} />}
                                                    </div>
                                                    <div>
                                                        <p style={{ fontWeight: 900, fontSize: '0.9rem' }}>{group.profile.full_name}</p>
                                                        <p style={{ fontSize: '0.75rem', color: isAllPaid ? '#81C784' : '#E57373' }}>
                                                            {isAllPaid ? 'QUITADO' : `PENDENTE: R$ ${group.total.toFixed(2)}`}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                    <button 
                                                        onClick={() => group.records.forEach((r: any) => handleTogglePayment(r.id, !isAllPaid, event, group.profile, group.records))}
                                                        style={{ background: isAllPaid ? 'transparent' : 'var(--primary)', border: isAllPaid ? '1px solid var(--primary)' : 'none', color: isAllPaid ? 'var(--primary)' : 'black', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 900, cursor: 'pointer' }}
                                                    >
                                                        {isAllPaid ? 'ESTORNAR' : 'QUITAR'}
                                                    </button>
                                                    {!isAllPaid && (
                                                        <button 
                                                            onClick={() => sendReminder(event, group.profile, group.total)}
                                                            style={{ background: '#25D366', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                                                            title="Enviar lembrete WhatsApp"
                                                        >
                                                            <MessageCircle size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* PERSONAL RSVP COLUMN */}
                    <div style={{ background: 'var(--surface-container-high)', padding: '2.5rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div>
                             <p className="label" style={{ fontSize: '0.7rem', opacity: 0.5 }}>VALOR INDIVIDUAL</p>
                             <h4 style={{ fontSize: '2.5rem', fontWeight: 900 }}>R$ {myBill.toFixed(2)}</h4>
                        </div>

                        {!userId ? (
                            <button onClick={() => router.push('/login')} className="btn-primary">LOGAR PARA PARTICIPAR</button>
                        ) : !isConfirmed ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <select className="input-field" value={selectedBeers[event.id] || 'nenhuma'} onChange={(e) => setSelectedBeers({...selectedBeers, [event.id]: e.target.value})}>
                                    <option value="nenhuma">NÃO VOU BEBER</option>
                                    {availableBeers.map(b => <option key={b.id} value={b.id}>{b.name.toUpperCase()} (+R$ {b.price.toFixed(2)})</option>)}
                                </select>
                                <button onClick={() => handleJoin(event.id)} className="btn-primary">CONFIRMAR PRESENÇA</button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--surface-container-low)', borderRadius: '4px' }}>
                                     {myAttendanceRecords.every((r: any) => r.is_paid) ? (
                                         <p style={{ color: '#81C784', fontWeight: 900, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><CheckCircle2 size={16}/> SEU PAGAMENTO CONCLUÍDO</p>
                                     ) : (
                                         <p style={{ color: '#E57373', fontWeight: 900, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><AlertCircle size={16}/> AGUARDANDO QUITAÇÃO</p>
                                     )}
                                </div>
                                <button onClick={() => setGuestInputs({...guestInputs, [event.id]: { name: '', beer: 'nenhuma', isAdding: true }})} className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}>+ CONVIDADO</button>
                                
                                {guestInputs[event.id]?.isAdding && (
                                    <div style={{ padding: '1rem', background: 'var(--surface-container-low)', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <input className="input-field" placeholder="Nome" value={guestInputs[event.id].name} onChange={(e) => setGuestInputs({...guestInputs, [event.id]: {...guestInputs[event.id], name: e.target.value}})} />
                                        <select className="input-field" value={guestInputs[event.id].beer} onChange={(e) => setGuestInputs({...guestInputs, [event.id]: {...guestInputs[event.id], beer: e.target.value}})}>
                                            <option value="nenhuma">SEM BEBIDA</option>
                                            {availableBeers.map(b => <option key={b.id} value={b.id}>{b.name.toUpperCase()}</option>)}
                                        </select>
                                        <button onClick={() => handleJoin(event.id, guestInputs[event.id].name, guestInputs[event.id].beer)} className="btn-primary" style={{ fontSize: '0.7rem' }}>ADICIONAR</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
              )
        })}
      </div>
    </div>
  )
}
