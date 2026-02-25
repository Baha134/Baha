export interface SkillVerification {
  verifier: string
  role: string
  date: string
  context: string
}

export interface SkillDetail {
  skill: string
  hard: number
  soft: number
  category: "hard" | "soft" | "both"
  verifications: SkillVerification[]
}

export interface BadgeVerifier {
  name: string
  title: string
  department: string
}

export interface AchievementBadge {
  id: number
  title: string
  icon: "code" | "brain" | "trophy" | "file" | "star" | "cpu" | "palette" | "shield"
  category: "skill" | "academic" | "competition" | "certification"
  date: string
  verified: boolean
  description: string
  verifier: BadgeVerifier
}

export interface Recommendation {
  id: number
  professorName: string
  initials: string
  department: string
  text: string
  date: string
  course: string
  verified: boolean
}

export interface ActivityLogEntry {
  id: number
  type: "skill_verified" | "achievement_added" | "recommendation_received" | "certification_added"
  title: string
  description: string
  date: string
  icon: "check" | "trophy" | "message" | "file" | "shield" | "star"
}

export interface TalentSkill {
  name: string
  level: "expert" | "advanced" | "intermediate"
}

export interface TalentStudent {
  id: number
  name: string
  avatar: string
  university: string
  faculty: string
  year: number
  gpa: number
  percentile: number
  availableForInternship: boolean
  location: string
  skills: TalentSkill[]
  achievements: number
  recommendations: number
  matchScore: number
  bio: string
  tags: string[]
}

export interface CurrentStudent {
  id: string
  firstName: string
  lastName: string
  avatar: string
  email: string
  university: string
  universityShort: string
  faculty: string
  facultyShort: string
  specialty: string
  year: number
  enrollmentYear: number
  location: string
  gpa: number
  maxGpa: number
  semester: string
  gpaChange: number
  credits: { earned: number; total: number }
  deansListStatus: boolean
  availableForInternship: boolean
  bio: string
}

export interface StudentData {
  currentStudent: CurrentStudent
  skills: SkillDetail[]
  achievements: AchievementBadge[]
  recommendations: Recommendation[]
  activityLog: ActivityLogEntry[]
  talentPool: TalentStudent[]
}
