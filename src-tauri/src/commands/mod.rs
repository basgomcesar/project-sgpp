pub mod students;
pub mod practices;
pub mod schools;
pub mod teachers;
pub mod groups;

pub use students::{create_student, get_students, delete_student,get_student_by_id,update_student};
pub use practices::{get_practices_by_student_id,create_practice ,delete_practice};
pub use schools::{get_schools,create_school,get_school_by_id,get_all_contexts,create_tutor,get_tutors_by_school_id,get_accompanying_teachers};
pub use teachers::{get_teachers, create_teacher, get_teachers_by_student_id};
pub use groups::{get_groups, get_group_by_id,add_student_to_group, create_group};
