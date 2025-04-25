pub mod students;
pub mod practices;

pub use students::{create_student, get_students, delete_student,get_student_by_id,update_student};
pub use practices::get_practices_by_student_id;