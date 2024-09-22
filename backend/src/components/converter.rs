use serde_json::json;

pub fn convert_to_json(id: u32, name: String, request: String) -> String {
	let json_request = json!({
		"id": id,
		"name": name,
		"request": request
	});
	json_request.to_string()
} 
