import { Invitation, Gift, Vendor } from "@/types";

export const mockInvitations: Invitation[] = [
  {
    id: "1",
    slug: "familia-silva",
    familyName: "Família Silva",
    type: "standard",
    coverImageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    message: "Querida Família Silva, é com grande alegria que os convidamos para celebrar o nosso casamento.",
    people: [
      { id: "p1", name: "João Silva", phone: "11999990001", status: "confirmed" },
      { id: "p2", name: "Maria Silva", phone: "11999990002", status: "confirmed" },
      { id: "p3", name: "Pedro Silva", phone: "11999990003", status: "pending" },
    ],
    createdAt: "2025-06-01",
  },
  {
    id: "2",
    slug: "familia-oliveira",
    familyName: "Família Oliveira",
    type: "godparent",
    coverImageUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
    message: "Queridos padrinhos, seria uma honra contar com a presença de vocês neste dia tão especial.",
    people: [
      { id: "p4", name: "Carlos Oliveira", phone: "11999990004", status: "confirmed" },
      { id: "p5", name: "Ana Oliveira", phone: "11999990005", status: "confirmed" },
    ],
    createdAt: "2025-06-02",
  },
  {
    id: "3",
    slug: "familia-santos",
    familyName: "Família Santos",
    type: "standard",
    coverImageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
    message: "Prezada Família Santos, convidamos vocês para o nosso casamento.",
    people: [
      { id: "p6", name: "Ricardo Santos", phone: "11999990006", status: "pending" },
      { id: "p7", name: "Fernanda Santos", phone: "11999990007", status: "declined" },
    ],
    createdAt: "2025-06-03",
  },
  {
    id: "4",
    slug: "familia-costa",
    familyName: "Família Costa",
    type: "godparent",
    coverImageUrl: "https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?w=800&q=80",
    message: "Queridos padrinhos Costa, venham celebrar conosco!",
    people: [
      { id: "p8", name: "Lucas Costa", phone: "11999990008", status: "pending" },
      { id: "p9", name: "Juliana Costa", phone: "11999990009", status: "pending" },
    ],
    createdAt: "2025-06-04",
  },
];

export const mockGifts: Gift[] = [
  {
    id: "g1",
    name: "Jogo de Panelas Tramontina",
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
    purchaseUrl: "https://example.com/panelas",
    active: true,
  },
  {
    id: "g2",
    name: "Jogo de Cama King",
    imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80",
    purchaseUrl: "https://example.com/cama",
    active: true,
  },
  {
    id: "g3",
    name: "Aparelho de Jantar",
    imageUrl: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=400&q=80",
    purchaseUrl: "https://example.com/jantar",
    active: true,
  },
  {
    id: "g4",
    name: "Cafeteira Expresso",
    imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&q=80",
    purchaseUrl: "https://example.com/cafe",
    active: false,
  },
];

export const mockVendors: Vendor[] = [
  {
    id: "v1",
    company: "Buffet Elegance",
    category: "Buffet",
    contact: "Roberto Almeida",
    phone: "11999880001",
    totalPrice: 25000,
    amountPaid: 12500,
    notes: "Menu degustação agendado para março",
  },
  {
    id: "v2",
    company: "Foto & Arte Studio",
    category: "Fotografia",
    contact: "Camila Ferreira",
    phone: "11999880002",
    totalPrice: 8000,
    amountPaid: 4000,
    notes: "Inclui ensaio pré-wedding",
  },
  {
    id: "v3",
    company: "Flores do Campo",
    category: "Decoração",
    contact: "Helena Martins",
    phone: "11999880003",
    totalPrice: 12000,
    amountPaid: 6000,
    notes: "Paleta de cores: marfim e verde",
  },
  {
    id: "v4",
    company: "DJ Marcelo",
    category: "Música",
    contact: "Marcelo Souza",
    phone: "11999880004",
    totalPrice: 5000,
    amountPaid: 5000,
    notes: "Pagamento completo",
  },
];
