export const ALL_PERMISSIONS = {
  USERS: {
    CREATE: { method: "POST", apiPath: "/user", module: "USER" },
    GET_PAGINATE: { method: "GET", apiPath: "/user", module: "USER" },
    GET_BY_ID: { method: "GET", apiPath: "/user/:id", module: "USER" },
    GET_ME: { method: "GET", apiPath: "/user/me", module: "USER" },
    GET_BY_EMAIL: { method: "GET", apiPath: "/user/by-email/:email", module: "USER" },
    UPDATE: { method: "PUT", apiPath: "/user/:id", module: "USER" },
    DELETE: { method: "DELETE", apiPath: "/user/:id", module: "USER" },
  },

  ROLES: {
    CREATE: { method: "POST", apiPath: "/rbac/role", module: "RBAC" },
    UPDATE: { method: "PUT", apiPath: "/rbac/role/:id", module: "RBAC" },
    DELETE: { method: "DELETE", apiPath: "/rbac/role/:id", module: "RBAC" },
    GET_PAGINATE: { method: "GET", apiPath: "/rbac/roles/pageable", module: "RBAC" },
    GET_BY_ID: { method: "GET", apiPath: "/rbac/roles/:id", module: "RBAC" },
  },

  PERMISSIONS: {
    CREATE: { method: "POST", apiPath: "/rbac/permission", module: "RBAC" },
    UPDATE: { method: "PUT", apiPath: "/rbac/permission/:id", module: "RBAC" },
    DELETE: { method: "DELETE", apiPath: "/rbac/permission/:id", module: "RBAC" },
    GET_PAGINATE: { method: "GET", apiPath: "/rbac/permissions/pageable", module: "RBAC" },
    GET_BY_ID: { method: "GET", apiPath: "/rbac/permissions/:id", module: "RBAC" },
    CHECK_USER_PERMISSION: { method: "POST", apiPath: "/rbac/check-permission", module: "RBAC" },
    ASSIGN_ROLE: { method: "POST", apiPath: "/rbac/assign-role", module: "RBAC" },
  },

  EXAMS: {
    CREATE: { method: "POST", apiPath: "/exams", module: "EXAMS" },
    GET_PAGINATE: { method: "GET", apiPath: "/exams", module: "EXAMS" },
    GET_BY_ID: { method: "GET", apiPath: "/exams/:id", module: "EXAMS" },
    UPDATE: { method: "PUT", apiPath: "/exams/:id", module: "EXAMS" },
    DELETE: { method: "DELETE", apiPath: "/exams/:id", module: "EXAMS" },
  },

  EXAM_TYPES: {
    CREATE: { method: "POST", apiPath: "/exam-types", module: "EXAM_TYPES" },
    GET_PAGINATE: { method: "GET", apiPath: "/exam-types", module: "EXAM_TYPES" },
    GET_BY_ID: { method: "GET", apiPath: "/exam-types/:id", module: "EXAM_TYPES" },
    UPDATE: { method: "PUT", apiPath: "/exam-types/:id", module: "EXAM_TYPES" },
    DELETE: { method: "DELETE", apiPath: "/exam-types/:id", module: "EXAM_TYPES" },
  },

  GRADE_LEVELS: {
    CREATE: { method: "POST", apiPath: "/grade-levels", module: "GRADE_LEVELS" },
    GET_PAGINATE: { method: "GET", apiPath: "/grade-levels", module: "GRADE_LEVELS" },
    GET_BY_ID: { method: "GET", apiPath: "/grade-levels/:id", module: "GRADE_LEVELS" },
    UPDATE: { method: "PUT", apiPath: "/grade-levels/:id", module: "GRADE_LEVELS" },
    DELETE: { method: "DELETE", apiPath: "/grade-levels/:id", module: "GRADE_LEVELS" },
  },

  SUBJECTS: {
    CREATE: { method: "POST", apiPath: "/subjects", module: "SUBJECTS" },
    GET_PAGINATE: { method: "GET", apiPath: "/subjects", module: "SUBJECTS" },
    GET_BY_ID: { method: "GET", apiPath: "/subjects/:id", module: "SUBJECTS" },
    UPDATE: { method: "PUT", apiPath: "/subjects/:id", module: "SUBJECTS" },
    DELETE: { method: "DELETE", apiPath: "/subjects/:id", module: "SUBJECTS" },
  },

  QUESTIONS: {
    CREATE: { method: "POST", apiPath: "/questions", module: "QUESTIONS" },
    GET_PAGINATE: { method: "GET", apiPath: "/questions", module: "QUESTIONS" },
    GET_BY_ID: { method: "GET", apiPath: "/questions/:id", module: "QUESTIONS" },
    UPDATE: { method: "PUT", apiPath: "/questions/:id", module: "QUESTIONS" },
    DELETE: { method: "DELETE", apiPath: "/questions/:id", module: "QUESTIONS" },
  }
};
