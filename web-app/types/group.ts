export type EditPermission = "OWNER_ONLY" | "ALL_MEMBERS" | "OWN_TRANSACTIONS_ONLY"
export type MemberRole = "OWNER" | "MEMBER"

export type GroupMember = {
  id: string
  role: MemberRole
  isActive: boolean
  joinedAt: string
  user: {
    id: string
    name: string
    email: string
    photo: string | null
  }
}

export type Group = {
  id: string
  name: string
  description: string
  editPermission: EditPermission
  owner: {
    id: string
    name: string
    email: string
    photo: string | null
  }
  members: GroupMember[]
  transactionCount: number
  createdAt: string
  updatedAt: string
}

export type CreateGroupDTO = {
  name: string
  description?: string
  editPermission: EditPermission
}

export type Invite = {
  id: string
  email: string
  token: string
  status: "PENDING" | "ACCEPTED" | "EXPIRED" | "REJECTED"
  expiresAt: string
  acceptedAt?: string
  group?: { id: string; name: string }
  invitedByUser?: { name: string; email: string; photo: string | null }
  createdAt: string
}
