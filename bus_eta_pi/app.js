var station_IDs = {
	KTET: ["8FAF102A11AB6C80", "84F4FB113301C3B6", "92AA28BBE48D6B2E", "215D99B3E2A5F8DD", "2004396"],
	KTSM: ["57A0D4D6D4D57497", "2008454"],
	LPH: ["736E84A8060D2AB9", "001713"]
};

let refresh_interval_ms = 7000;

window.onload = function() {
	//define header block and secton block
	var body_block = document.querySelector("body");
	var header_block = document.querySelector("header");
	var section_block = document.querySelector("section");
	var main_bar_block = document.getElementById("main_bar");

	//get all the elements
	var last_update_div = document.getElementById("last_update_div");
	
	function remove_all_child_nodes_from(target_parent_node) {
		while (target_parent_node.firstChild)
			target_parent_node.removeChild(target_parent_node.firstChild);
	}

	function refresh_ETA_KMB(div_name, route, stop_ID, service_type) {
		console.log(div_name.id + " " + route + " " + stop_ID)
		let url = "https://data.etabus.gov.hk/v1/transport/kmb/eta/" + stop_ID + "/" + route + "/" + service_type
		fetch(url)
		.then( response => {
			if (response.status == 200) {
				response.json().then( ETA_json => {
					//Populate div
					//Create ETA block devs
					
					let ETA_block = document.createElement("div");
					ETA_block.setAttribute("class", route + " route");
					div_name.appendChild(ETA_block);
					
					let ETA_block_text = document.createElement("span");
					ETA_block_text.setAttribute("class", "route_name");
					ETA_block_text.innerHTML = route;
					ETA_block.appendChild(ETA_block_text);
					
					//Create ETA item devs
					let ETA_to_show = ETA_json.data.length;
					if(ETA_json.data.length > 3)
						ETA_to_show = 3;
					
					let ETA_shown = 0;
					
					//find out all the ETAs
					if(ETA_json.data.length != 0) {
						for(let i = 0; i < (ETA_json.data.length || ETA_shown == ETA_to_show); i++) {
							// skip not matching route
							if(ETA_json.data[i].route == route) {
								//special case for Kwong Tin Terminus
								if(stop_ID == "84F4FB113301C3B6" || stop_ID == "92AA28BBE48D6B2E" || stop_ID == "215D99B3E2A5F8DD") {
									if(ETA_json.data[i].seq != 1) {
										continue;
									}
								}
								
								let ETA_item = document.createElement("div");
								if(ETA_shown == 0) {
								    ETA_item.setAttribute("class", "ETA_item ETA_item_first");
								} else {
								    ETA_item.setAttribute("class", "ETA_item");
								}
								ETA_block.appendChild(ETA_item);
									
								let ETA_text = document.createElement("span");
								ETA_text.setAttribute("class", "ETA_text");
								ETA_item.appendChild(ETA_text);
								let ETA_text_suffix = document.createElement("span");
								ETA_text_suffix.setAttribute("class", "ETA_text_suffix");
								ETA_item.appendChild(ETA_text_suffix);
									
								let ms_diff = Date.parse(ETA_json.data[i].eta) - Date.now()
								//console.log(ms_diff)
								let min_diff = Math.round(ms_diff/1000/60)
								
								let text = "";
								let text_suffix = "";

								if(min_diff <= 0) {
									if(ETA_json.data[i].seq == 1)
										text = "就開";
									else
										text = "就到";
								} else if (ETA_json.data[i].eta == null) {
									text = "無資料";
								} else {
									text = min_diff + " 分鐘";
									//if(min_diff != 1)
									//	text += "s";
								}
								
								if(ETA_json.data[i].rmk_en != "") {
									if(ETA_json.data[i].rmk_en == "Scheduled Bus") {
										//text += " (預)";
										text_suffix = "(預)";
									} else if (ETA_json.data[i].rmk_en == "Final Bus") {
										//text += " (尾)";
										text_suffix = "(尾)";
									} else if (ETA_json.data[i].rmk_en == "The final bus has departed from this stop"){
										//text = "Final bus departed";
										//text = "最後班次已開出";
										text = "End";
									} else if (ETA_json.data[i].rmk_en == "Moving slowly") {
										//text += " (慢)";
										text_suffix = "(慢)";
									} else if (ETA_json.data[i].rmk_en == "This route only operates on Mondays to Fridays (Except Public Holidays)") {
										//text += " (慢)";
										text_suffix = "(Mon-Fri only)";
									} else {
										//text += " (" + ETA_json.data[i].rmk_tc + ")";
										text_suffix = "(" + ETA_json.data[i].rmk_tc + ")";
									}
								}
								
								ETA_text.innerHTML = text;
								ETA_text_suffix.innerHTML = text_suffix;
								
								ETA_shown++;
							}
						}
					}

					//if there are no record
					if(ETA_shown == 0 || ETA_json.data.length == 0) {
						let ETA_item = document.createElement("div");
						ETA_item.setAttribute("class", "ETA_item ETA_item_first");
						ETA_block.appendChild(ETA_item);
						
						let ETA_text = document.createElement("span");
						ETA_text.setAttribute("class", "ETA_text ETA_text_no_data");
						ETA_text.innerHTML = "無資料";
						ETA_item.appendChild(ETA_text);
					}
				});
			}
		});
	}
	
	function refresh_ETA_CTB(div_name, route, stop_ID, seq_number) {
		console.log(div_name.id + " " + route + " " + stop_ID)
		let url = "https://rt.data.gov.hk/v1/transport/citybus-nwfb/eta/CTB/" + stop_ID + "/" + route
		fetch(url)
		.then( response => {
			if (response.status == 200) {
				response.json().then( ETA_json => {
					//Populate div
					//Create ETA block devs
					
					let ETA_block = document.createElement("div");
					ETA_block.setAttribute("class", route + " route");
					div_name.appendChild(ETA_block);
					
					let ETA_block_text = document.createElement("span");
					ETA_block_text.setAttribute("class", "route_name");
					ETA_block_text.innerHTML = route;
					ETA_block.appendChild(ETA_block_text);
					
					//Create ETA item devs
					let ETA_to_show = ETA_json.data.length;
					if(ETA_json.data.length > 3)
						ETA_to_show = 3;
					
					let ETA_shown = 0;
					
					//find out all the ETAs
					if(ETA_json.data.length != 0) {
						for(let i = 0; i < (ETA_json.data.length || ETA_shown == ETA_to_show); i++) {
							// skip not matching route
							if(ETA_json.data[i].route == route && ETA_json.data[i].seq == seq_number) {
								
								let ETA_item = document.createElement("div");
								if(ETA_shown == 0) {
                                	ETA_item.setAttribute("class", "ETA_item ETA_item_first");
                                } else {
                                	ETA_item.setAttribute("class", "ETA_item");
                                }
								ETA_block.appendChild(ETA_item);
									
								let ETA_text = document.createElement("span");
								ETA_text.setAttribute("class", "ETA_text");
								ETA_item.appendChild(ETA_text);
									
								let ms_diff = Date.parse(ETA_json.data[i].eta) - Date.now()
								//console.log(ms_diff)
								let min_diff = Math.round(ms_diff/1000/60)
								
								let text = "";
								if(min_diff <= 0) {
									text = "就到";
								} else if (ETA_json.data.length == 0) { 
									text = "無資料";
								} else {
									text = min_diff + " 分鐘";
									//if(min_diff != 1)
									//	text += "s";
								}
								
								if(ETA_json.data[i].rmk_en != "") {
									text += " (" + ETA_json.data[i].rmk_en + ")";
								}
								
								ETA_text.innerHTML = text;
								
								ETA_shown++;
							}
						}
					}

					//if there are no record
					if(ETA_shown == 0 || ETA_json.data.length == 0) {
						let ETA_item = document.createElement("div");
						ETA_item.setAttribute("class", "ETA_item ETA_item_first");
						ETA_block.appendChild(ETA_item);
						
						let ETA_text = document.createElement("span");
						ETA_text.setAttribute("class", "ETA_text ETA_text_no_data");
						ETA_text.innerHTML = "無資料";
						ETA_item.appendChild(ETA_text);
					}
				});
			}
		});
	}
	
	function refresh_ETA_GMB(div_name, route, route_id, route_seq, stop_seq) {
		console.log(div_name.id + " " + route + " " + route_id + " " + route_seq + " " + stop_seq)
		let url = "https://data.etagmb.gov.hk/eta/route-stop/" + route_id + "/" + route_seq + "/" + stop_seq
		fetch(url)
		.then( response => {
			if (response.status == 200) {
				response.json().then( ETA_json => {
					//Populate div
					//Create ETA block devs
					
					let ETA_block = document.createElement("div");
					ETA_block.setAttribute("class", route + " route route_GMB");
					div_name.appendChild(ETA_block);
					
					let ETA_block_text = document.createElement("span");
					ETA_block_text.setAttribute("class", "route_name route_name_GMB");
					ETA_block_text.innerHTML = route;
					ETA_block.appendChild(ETA_block_text);
					
					//Create ETA item devs
					let ETA_to_show = ETA_json.data.length;
					if(ETA_json.data.length > 3)
						ETA_to_show = 3;
					
					let ETA_shown = 0;
					
					//find out all the ETAs
					if(ETA_json.data.eta.length != 0) {
						for(let i = 0; i < (ETA_json.data.eta.length || ETA_shown == ETA_to_show); i++) {

							let ETA_item = document.createElement("div");
							if(ETA_shown == 0) {
                                ETA_item.setAttribute("class", "ETA_item ETA_item_first");
                            } else {
                                ETA_item.setAttribute("class", "ETA_item");
                            }
							ETA_block.appendChild(ETA_item);
									
							let ETA_text = document.createElement("span");
							ETA_text.setAttribute("class", "ETA_text");
							ETA_item.appendChild(ETA_text);
							let ETA_text_suffix = document.createElement("span");
							ETA_text_suffix.setAttribute("class", "ETA_text_suffix");
							ETA_item.appendChild(ETA_text_suffix);
								
							let ms_diff = Date.parse(ETA_json.data.eta[i].timestamp) - Date.now()
							//console.log(ms_diff)
							let min_diff = Math.round(ms_diff/1000/60)
							
							let text = "";
							if(min_diff <= 0) {
								text = "就到";
							} else if (ETA_json.data.eta.length == 0) { 
								text = "無資料";
							} else {
								text = min_diff + " 分鐘";
								//if(min_diff != 1)
								//	text += "s";
							}
							
							if(ETA_json.data.eta[i].remarks_en != "" && ETA_json.data.eta[i].remarks_en != null) {
								if(ETA_json.data.eta[i].remarks_en == "Scheduled") {
									text_suffix = "(預)";
								} else {
									text_suffix = "(" + ETA_json.data.eta[i].remarks_tc + ")";
								}
							}
							
							ETA_text.innerHTML = text;
							ETA_text_suffix.innerHTML = text_suffix;
							
							ETA_shown++;
						}
					}

					//if there are no record
					if(ETA_shown == 0 || ETA_json.data.eta.length == 0) {
						let ETA_item = document.createElement("div");
						ETA_item.setAttribute("class", "ETA_item ETA_item_first");
						ETA_block.appendChild(ETA_item);
						
						let ETA_text = document.createElement("span");
						ETA_text.setAttribute("class", "ETA_text ETA_text_no_data");
						ETA_text.innerHTML = "無資料";
						ETA_item.appendChild(ETA_text);
					}
				});
			}
		});
	}
	
	function refresh_last_update() {
		let target_div = document.getElementById("last_update_div");
		let time_now = new Date();
		let final_time = "Last update ";
		if(time_now.getHours() >= 0 && time_now.getHours() <= 9)
			final_time += '0';
		final_time += time_now.getHours() + ":";
		if(time_now.getMinutes() >= 0 && time_now.getMinutes() <= 9)
			final_time += '0';
		final_time += time_now.getMinutes() + ":";
		if(time_now.getSeconds() >= 0 && time_now.getSeconds() <= 9)
			final_time += '0';
		final_time += time_now.getSeconds();
		target_div.firstElementChild.innerHTML = final_time;
	}
	
	function refresh_KTET_div() {
        let target_div = document.getElementById("Kwong Tin Estate Terminus");
		remove_all_child_nodes_from(target_div);
		refresh_ETA_KMB(target_div, "216M", station_IDs.KTET[0], "1");
		refresh_ETA_KMB(target_div, "14B", station_IDs.KTET[1], "1");
		refresh_ETA_KMB(target_div, "16", station_IDs.KTET[2], "1");
		refresh_ETA_KMB(target_div, "215X", station_IDs.KTET[3], "1");
		refresh_last_update();
	}
	
	function refresh_KTET2_div() {
        let target_div = document.getElementById("Kwong Tin Estate Terminus 2");
		remove_all_child_nodes_from(target_div);
		refresh_ETA_KMB(target_div, "15X", station_IDs.KTET[0], "1");
		refresh_ETA_GMB(target_div, "63", station_IDs.KTET[4], "1", "1");
		refresh_last_update();
	}

	function refresh_KTSM_div() {
		let target_div = document.getElementById("Kwong Tin Shopping Mall");
		remove_all_child_nodes_from(target_div);
		refresh_ETA_KMB(target_div, "216M", station_IDs.KTSM[0], "1");
		refresh_ETA_KMB(target_div, "214", station_IDs.KTSM[0], "1");
		refresh_ETA_KMB(target_div, "14H", station_IDs.KTSM[0], "1");
		refresh_ETA_GMB(target_div, "24M", station_IDs.KTSM[1], "1", "6");
		refresh_last_update();
	}
	
	function refresh_KTSM2_div() {
		let target_div = document.getElementById("Kwong Tin Shopping Mall 2");
		remove_all_child_nodes_from(target_div);
		refresh_ETA_KMB(target_div, "88X", station_IDs.KTSM[0], "1");
		refresh_ETA_KMB(target_div, "603", station_IDs.KTSM[0], "1");
		refresh_ETA_KMB(target_div, "603A", station_IDs.KTSM[0], "1");
		refresh_ETA_KMB(target_div, "613", station_IDs.KTSM[0], "1");
		refresh_last_update();
	}

	function refresh_LPH_div() {
	    let target_div = document.getElementById("Lung Pak House");
		remove_all_child_nodes_from(target_div);
		refresh_ETA_KMB(target_div, "216M", station_IDs.LPH[0], "1");
		refresh_ETA_CTB(target_div, "E22X", station_IDs.LPH[1], 5);
		refresh_ETA_CTB(target_div, "E22P", station_IDs.LPH[1], 5);
		refresh_last_update();
	}

    function switch_display_div(from_div_name, to_div_name) {
        var from_div = document.getElementById(from_div_name);
        var to_div = document.getElementById(to_div_name);

        from_div.style.display = "none";
        to_div.style.display = "inline";

        from_div_name = to_div_name;
		
        if(to_div_name == "KTET2_div") {
             refresh_KTET2_div();
             to_div_name = "KTSM_div";
        } else if(to_div_name == "KTSM_div") {
             refresh_KTSM_div();
             to_div_name = "KTSM2_div";
        } else if(to_div_name == "KTSM2_div") {
             refresh_KTSM2_div();
             to_div_name = "LPH_div";
        } else if(to_div_name == "LPH_div") {
             refresh_LPH_div();
             to_div_name = "KTET_div";
        } else if(to_div_name == "KTET_div") {
             refresh_KTET_div();
             to_div_name = "KTET2_div";
        }

        setTimeout(function() {switch_display_div(from_div_name, to_div_name)}, refresh_interval_ms);
    }

	refresh_KTET_div();
	setTimeout(function() {switch_display_div("KTET_div", "KTET2_div")}, 5000);
}