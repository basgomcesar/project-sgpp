// @generated automatically by Diesel CLI.

diesel::table! {
    accompanying_teacher (id) {
        id -> Int4,
        #[max_length = 500]
        full_name -> Nullable<Varchar>,
    }
}

diesel::table! {
    assigned_tutors (id) {
        id -> Int4,
        #[max_length = 500]
        full_name -> Nullable<Varchar>,
        school_id -> Nullable<Int4>,
    }
}

diesel::table! {
    contexts (id) {
        id -> Int4,
        #[max_length = 500]
        context_name -> Nullable<Varchar>,
    }
}

diesel::table! {
    group_teachers (id) {
        id -> Int4,
        #[max_length = 500]
        full_name -> Nullable<Varchar>,
    }
}

diesel::table! {
    groups (id) {
        id -> Int4,
        #[max_length = 500]
        course_name -> Nullable<Varchar>,
        teacher_id -> Nullable<Int4>,
    }
}

diesel::table! {
    groups_students (id) {
        id -> Int4,
        id_student -> Nullable<Int4>,
        id_group -> Nullable<Int4>,
    }
}

diesel::table! {
    intern_students (id) {
        id -> Int4,
        #[max_length = 500]
        control_number -> Nullable<Varchar>,
        #[max_length = 500]
        full_name -> Nullable<Varchar>,
        semester_id -> Nullable<Int4>,
        accumulated_hours -> Nullable<Int4>,
    }
}

diesel::table! {
    practices (id) {
        id -> Int8,
        school_id -> Nullable<Int4>,
        student_id -> Nullable<Int4>,
        group_teacher_id -> Nullable<Int4>,
        initial_date -> Nullable<Timestamp>,
        final_date -> Nullable<Timestamp>,
        accompanying_teacher_id -> Nullable<Int4>,
        #[max_length = 500]
        grade_and_group -> Nullable<Varchar>,
        assigned_tutor_id -> Nullable<Int4>,
        practice_hours -> Nullable<Int4>,
    }
}

diesel::table! {
    schools (id) {
        id -> Int4,
        #[max_length = 500]
        cct -> Nullable<Varchar>,
        #[max_length = 500]
        school_name -> Nullable<Varchar>,
        #[max_length = 500]
        director_name -> Nullable<Varchar>,
        #[max_length = 500]
        address -> Nullable<Varchar>,
        #[max_length = 500]
        sector -> Nullable<Varchar>,
        #[max_length = 500]
        zone -> Nullable<Varchar>,
        #[max_length = 500]
        locality -> Nullable<Varchar>,
        sector_cheif_id -> Nullable<Int4>,
        zone_supervisor -> Nullable<Int4>,
        context_id -> Nullable<Int4>,
    }
}

diesel::table! {
    sector_chiefs (id) {
        id -> Int4,
        #[max_length = 500]
        full_name -> Nullable<Varchar>,
    }
}

diesel::table! {
    semesters (id) {
        id -> Int4,
        #[max_length = 500]
        semester_name -> Nullable<Varchar>,
    }
}

diesel::table! {
    zone_supervisors (id) {
        id -> Int4,
        #[max_length = 500]
        full_name -> Nullable<Varchar>,
    }
}

diesel::joinable!(assigned_tutors -> schools (school_id));
diesel::joinable!(groups -> group_teachers (teacher_id));
diesel::joinable!(groups_students -> groups (id_group));
diesel::joinable!(groups_students -> intern_students (id_student));
diesel::joinable!(intern_students -> semesters (semester_id));
diesel::joinable!(practices -> accompanying_teacher (accompanying_teacher_id));
diesel::joinable!(practices -> assigned_tutors (assigned_tutor_id));
diesel::joinable!(practices -> group_teachers (group_teacher_id));
diesel::joinable!(practices -> intern_students (student_id));
diesel::joinable!(practices -> schools (school_id));
diesel::joinable!(schools -> contexts (context_id));
diesel::joinable!(schools -> sector_chiefs (sector_cheif_id));
diesel::joinable!(schools -> zone_supervisors (zone_supervisor));

diesel::allow_tables_to_appear_in_same_query!(
    accompanying_teacher,
    assigned_tutors,
    contexts,
    group_teachers,
    groups,
    groups_students,
    intern_students,
    practices,
    schools,
    sector_chiefs,
    semesters,
    zone_supervisors,
);
