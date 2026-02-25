import type { StudentData } from "./types"
import rawData from "./students.json"

export const studentData = rawData as StudentData

export const {
  currentStudent,
  skills: skillsData,
  achievements: achievementsData,
  recommendations: recommendationsData,
  activityLog: activityLogData,
  talentPool: talentPoolData,
} = studentData

export type {
  SkillVerification,
  SkillDetail,
  BadgeVerifier,
  AchievementBadge,
  Recommendation,
  ActivityLogEntry,
  TalentSkill,
  TalentStudent,
  CurrentStudent,
  StudentData,
} from "./types"
