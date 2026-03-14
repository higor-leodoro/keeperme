export const mockUser = {
  id: "1",
  name: "Alex",
  lastName: "Morgan",
  email: "alex@keeperme.app",
  photo: null,
}

export const mockBalance = {
  totalBalance: 8450.0,
  totalIncome: 12000.0,
  totalExpense: 3550.0,
}

export const mockCategories = [
  { id: "1", name: "Food & Dining" },
  { id: "2", name: "Transport" },
  { id: "3", name: "Shopping" },
  { id: "4", name: "Housing" },
  { id: "5", name: "Health" },
  { id: "6", name: "Entertainment" },
]

export const mockTransactions = [
  {
    id: "1",
    amount: 4500,
    type: "INCOME" as const,
    description: "Monthly salary",
    date: "2025-02-01",
    category: { id: "4", name: "Housing" },
    groupId: null,
  },
  {
    id: "2",
    amount: 120,
    type: "EXPENSE" as const,
    description: "Grocery run",
    date: "2025-02-03",
    category: { id: "1", name: "Food & Dining" },
    groupId: null,
  },
  {
    id: "3",
    amount: 45,
    type: "EXPENSE" as const,
    description: "Uber",
    date: "2025-02-04",
    category: { id: "2", name: "Transport" },
    groupId: null,
  },
  {
    id: "4",
    amount: 300,
    type: "EXPENSE" as const,
    description: "New shoes",
    date: "2025-02-06",
    category: { id: "3", name: "Shopping" },
    groupId: null,
  },
  {
    id: "5",
    amount: 7500,
    type: "INCOME" as const,
    description: "Freelance project",
    date: "2025-02-10",
    category: { id: "4", name: "Housing" },
    groupId: null,
  },
  {
    id: "6",
    amount: 89,
    type: "EXPENSE" as const,
    description: "Pharmacy",
    date: "2025-02-11",
    category: { id: "5", name: "Health" },
    groupId: null,
  },
  {
    id: "7",
    amount: 60,
    type: "EXPENSE" as const,
    description: "Netflix + Spotify",
    date: "2025-02-14",
    category: { id: "6", name: "Entertainment" },
    groupId: null,
  },
  {
    id: "8",
    amount: 200,
    type: "EXPENSE" as const,
    description: "Restaurant dinner",
    date: "2025-02-17",
    category: { id: "1", name: "Food & Dining" },
    groupId: null,
  },
]

export const mockGroups = [
  {
    id: "1",
    name: "Apartment Expenses",
    description: "Shared costs for our apartment",
    editPermission: "OWN_TRANSACTIONS_ONLY",
    owner: {
      id: "1",
      name: "Alex Morgan",
      email: "alex@keeperme.app",
      photo: null,
    },
    members: [
      {
        id: "m1",
        role: "OWNER" as const,
        isActive: true,
        joinedAt: "2025-01-01",
        user: {
          id: "1",
          name: "Alex Morgan",
          email: "alex@keeperme.app",
          photo: null,
        },
      },
      {
        id: "m2",
        role: "MEMBER" as const,
        isActive: true,
        joinedAt: "2025-01-05",
        user: {
          id: "2",
          name: "Sam Costa",
          email: "sam@email.com",
          photo: null,
        },
      },
    ],
    transactionCount: 12,
    createdAt: "2025-01-01",
  },
  {
    id: "2",
    name: "Road Trip Fund",
    description: "Expenses for our July road trip",
    editPermission: "ALL_MEMBERS",
    owner: {
      id: "2",
      name: "Sam Costa",
      email: "sam@email.com",
      photo: null,
    },
    members: [
      {
        id: "m3",
        role: "MEMBER" as const,
        isActive: true,
        joinedAt: "2025-01-15",
        user: {
          id: "1",
          name: "Alex Morgan",
          email: "alex@keeperme.app",
          photo: null,
        },
      },
      {
        id: "m4",
        role: "OWNER" as const,
        isActive: true,
        joinedAt: "2025-01-10",
        user: {
          id: "2",
          name: "Sam Costa",
          email: "sam@email.com",
          photo: null,
        },
      },
    ],
    transactionCount: 5,
    createdAt: "2025-01-10",
  },
]

export const mockGroupTransactions = [
  {
    id: "g1",
    amount: 1200,
    type: "EXPENSE" as const,
    description: "Rent payment",
    date: "2025-02-01",
    category: { id: "4", name: "Housing" },
    groupId: "1",
    addedBy: "Alex Morgan",
  },
  {
    id: "g2",
    amount: 85,
    type: "EXPENSE" as const,
    description: "Electricity bill",
    date: "2025-02-05",
    category: { id: "4", name: "Housing" },
    groupId: "1",
    addedBy: "Sam Costa",
  },
  {
    id: "g3",
    amount: 45,
    type: "EXPENSE" as const,
    description: "Internet bill",
    date: "2025-02-07",
    category: { id: "4", name: "Housing" },
    groupId: "1",
    addedBy: "Alex Morgan",
  },
  {
    id: "g4",
    amount: 60,
    type: "EXPENSE" as const,
    description: "Cleaning supplies",
    date: "2025-02-12",
    category: { id: "3", name: "Shopping" },
    groupId: "1",
    addedBy: "Sam Costa",
  },
]

export const mockInvites = [
  {
    id: "inv1",
    email: "alex@keeperme.app",
    token: "abc-token",
    status: "PENDING" as const,
    expiresAt: "2025-03-01",
    group: { id: "3", name: "Work Lunch Group" },
    invitedByUser: {
      name: "Jordan Lee",
      email: "jordan@email.com",
      photo: null,
    },
    createdAt: "2025-02-18",
  },
]

export const mockSpendingByCategory = [
  { name: "Food & Dining", amount: 320 },
  { name: "Shopping", amount: 300 },
  { name: "Health", amount: 89 },
  { name: "Entertainment", amount: 60 },
  { name: "Transport", amount: 45 },
  { name: "Housing", amount: 0 },
]

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}
