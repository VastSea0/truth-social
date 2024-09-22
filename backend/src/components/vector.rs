// vector.rs

pub fn initialize_vector() -> Vec<(u32, String, String)> {
    Vec::new()
}

pub fn add_tuple_to_vector(vec: &mut Vec<(u32, String, String)>, num: u32, s1: String, s2: String) {
    vec.push((num, s1, s2));
}

pub fn delete_tuple_from_vector(vec: &mut Vec<(u32, String, String)>, num: u32, ) {
    vec.retain(|tuple| !(tuple.0 == num ));
}
