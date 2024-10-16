function toggleTextBox(type) {
 // Lấy trạng thái của các checkbox
 const isFaissChecked = document.getElementById("faiss").checked;
 const isOcrChecked = document.getElementById("ocr").checked;
 const isSubtitleChecked = document.getElementById("subtitle").checked;
 if (isOcrChecked || isSubtitleChecked) {
  // Hiển thị các hộp văn bản khi checkbox OCR hoặc Subtitle được chọn
  document.getElementById("text_boxes").style.display = "block";
 } else {
  document.getElementById("text_boxes").style.display = "none";
 }
 if (isFaissChecked && isOcrChecked) {
  // Kiểm tra checkbox faiss và OCR
  document.getElementById("keyword_container").style.display = "block";
  document.getElementById("image_count_container").style.display = "block";
 } else if (isOcrChecked) {
  document.getElementById("keyword_container").style.display = "block";
  document.getElementById("image_count_container").style.display = "none";
 } else {
  document.getElementById("keyword_container").style.display = "none";
  document.getElementById("image_count_container").style.display = "none";
 }
 if (isFaissChecked && isSubtitleChecked) {
  // Kiểm tra checkbox faiss và Subtitle
  document.getElementById("keyword_container").style.display = "block";
  document.getElementById("image_count_container").style.display = "block";
 } else if (isSubtitleChecked) {
  document.getElementById("keyword_container").style.display = "block";
  document.getElementById("image_count_container").style.display = "none";
 }
}

function add_paging() {
 console.log(data["num_page"]);
 var url = new URL(window.location.href);
 var cur_index = parseInt(url.searchParams.get("index"));
 var imgpath = url.searchParams.get("imgpath");
 if (cur_index == "undefined") {
  cur_index = 0;
 }
 var i = cur_index - 4;
 if (i > 0) {
  var iDiv = document.createElement("div");
  iDiv.className = "page_num";
  iDiv.innerHTML = "...";
  document.getElementById("div_page").appendChild(iDiv);
 }
 for (i; i < data["num_page"] && i < cur_index + 4; i++) {
  if (i < 0) {
   i = 0;
  }
  var iDiv = document.createElement("div");
  iDiv.className = "page_num";
  var iA = document.createElement("a");
  iA.href = "?index=" + i.toString() + "&imgpath=" + imgpath;
  iA.innerHTML = i.toString();
  if (i == cur_index) {
   iA.style.color = "green";
  }
  iDiv.appendChild(iA);
  document.getElementById("div_page").appendChild(iDiv);
 }
 if (i < data["num_page"]) {
  var iDiv = document.createElement("div");
  iDiv.className = "page_num";
  iDiv.innerHTML = "...";
  document.getElementById("div_page").appendChild(iDiv);
 }
 document.getElementById("div_total_page").innerHTML =
  "Total: " + data["num_page"].toString() + " page";
}

function processImagePath(imgpath) {
 let match = imgpath.match(/\/(\d{3})\.jpg$/);
 if (match && match[1]) {
  // Tách imgNum từ chuỗi match
  let imgNum = parseInt(match[1], 10); // Chuyển sang số nguyên từ chuỗi '002'
  let preImg = imgNum - 1; // Tính preImg và nextImg
  let nextImg = imgNum + 1;
  let preImgStr = preImg > 0 ? String(preImg).padStart(3, "0") : null; // Định dạng lại preImg và nextImg thành chuỗi 3 chữ số (ví dụ '001')
  let nextImgStr = String(nextImg).padStart(3, "0");
  return { imgNum, preImgStr, nextImgStr };
 } else {
  console.error("Không tìm thấy imgNum trong chuỗi imgpath");
  return null;
 }
}

function add_img(div_id_image) {
 let div_img = document.getElementById("div_img");
 let pagefile_list = data["pagefile"];
 pagefile_list.forEach((item, index) => {
  console.log(item.imgpath);
  let imgInfo = processImagePath(item.imgpath);
  if (!imgInfo) return; // Nếu không có imgInfo, bỏ qua mục này
  let { preImgStr, nextImgStr } = imgInfo;
  let preImgPath = preImgStr
   ? item.imgpath.replace(/(\d{3})(\.jpg)/, `${preImgStr}$2`)
   : null; // Tạo đường dẫn cho ảnh preImg và nextImg
  let nextImgPath = item.imgpath.replace(/(\d{3})(\.jpg)/, `${nextImgStr}$2`);
  // Kiểm tra nếu preImgPath hợp lệ, tạo ảnh thumbnail-left
  let previousImageHTML = preImgPath
   ? `
            <img class="thumbnail" onClick="go_img_search(${
             item.id - 1
            })" src="get_img?fpath=${preImgPath}" alt="Previous image">`
   : "";
  let nextImageHTML = `  
          <img class="thumbnail" onClick="go_img_search(${
           item.id + 1
          })"  src="get_img?fpath=${nextImgPath}" alt="Next image"> `;
  $("#div_img").append(
   `<div class= "container_img_btn"  onmouseover="mouseOver(${index})" onmouseout="mouseOut(${index})">
                        <button class="btn_knn" onClick="go_img_search(${item.id})">IR</button>
                        <button class="btn_yt" onClick="sendItemId('${item.imgpath}')">YT</button>
                        <button class="btn_c" onClick="get_Answer('${item.imgpath}')">C</button>
                        <div class="thumbnail-left">
                          ${previousImageHTML}
                        </div>
                        <img class="hoverImg" onclick="get_neighbor(${item.id})" src="get_img?fpath=${item.imgpath}">
                        <div class="thumbnail-right"> 
                          ${nextImageHTML}
                        </div>
                    </div>`
  ); // Tạo ảnh thumbnail-right cho nextImg
 });
}

function mouseOver(id) {
 btn_knn[id].style.display = "block";
 btn_select[id].style.display = "block";
 document.getElementsByClassName("btn_yt")[id].style.display = "block";
 document.getElementsByClassName("btn_c")[id].style.display = "block";
}

function mouseOut(id) {
 btn_knn[id].style.display = "none";
 btn_select[id].style.display = "none";
 document.getElementsByClassName("btn_yt")[id].style.display = "none";
 document.getElementsByClassName("btn_c")[id].style.display = "none";
}

function go_img_search(id) {
 window.open("/imgsearch?imgid=" + id);
}

function sendItemId(imgpath) {
 const xhr = new XMLHttpRequest(); // Tạo đối tượng XMLHttpRequest
 xhr.open("POST", "/submit_item", true); // Định nghĩa endpoint của Python
 xhr.setRequestHeader("Content-Type", "application/json"); // Gửi dưới dạng JSON
 const data = JSON.stringify({ imgpath: imgpath }); // Chuẩn bị dữ liệu JSON
 xhr.send(data); // Gửi dữ liệu tới backend
 xhr.onreadystatechange = function () {
  if (xhr.readyState == 4 && xhr.status == 200) {
   alert("Response: " + xhr.responseText); // Hiển thị phản hồi từ server
  }
 };
}

function get_Answer(imgpath) {
 const xhr = new XMLHttpRequest(); // Tạo đối tượng XMLHttpRequest
 xhr.open("POST", "/get_Answer", true); // Định nghĩa endpoint của Python
 xhr.setRequestHeader("Content-Type", "application/json"); // Gửi dưới dạng JSON
 const data = JSON.stringify({ imgpath: imgpath }); // Chuẩn bị dữ liệu JSON
 xhr.send(data); // Gửi dữ liệu tới backend
 xhr.onreadystatechange = function () {
  if (xhr.readyState == 4 && xhr.status == 200) {
   alert("Response: " + xhr.responseText); // Hiển thị phản hồi từ server
  }
 };
}

function on_load() {
 var url = new URL(window.location.href);
 var imgpath = url.searchParams.get("imgpath");
 if ("query" in data) {
  document.getElementById("text_query").value = data["query"];
 }
 add_paging();
 add_img("div_img");
}

function show_list_segment(id) {
 window.open("/showsegment?imgid=" + id);
}

function get_neighbor(id) {
 window.open("/getneighbor?imgid=" + id);
}

function youtube(youtubeLink) {
 window.open(youtubeLink);
}

function search() {
 text_query = document.getElementById("text_query").value; // Capture the text query
 faissChecked = document.getElementById("faiss").checked; // Get checkbox statuses
 ocrChecked = document.getElementById("ocr").checked;
 subtitleChecked = document.getElementById("subtitle").checked;
 cqChecked = document.getElementById("cq").checked;
 const numImages = document.getElementById("num_images").value || 100; // Get the number of images if provided
 let keywords = ""; // Get keywords if OCR or Subtitle is checked
 if (ocrChecked || subtitleChecked) {
  keywords = document.getElementById("keywords").value;
 }
 if (!faissChecked && !ocrChecked && !subtitleChecked) {
  faissChecked = true;
 }
 const searchQuery = {
  // Create the query object to send to the backend
  text_query: text_query,
  faiss: faissChecked,
  ocr: ocrChecked,
  subtitle: subtitleChecked,
  cq: cqChecked,
  keywords: keywords,
  num_images: numImages,
 };
 window.location.href =
  "/textsearch?" + new URLSearchParams(searchQuery).toString(); // Send the query as a GET request to the backend
 document.getElementById("text_query").innerHTML = text_query; // window.location.href = "/textsearch?textquery=" + text_query;
}

function loadSuggestions() {
 // Load the suggestions once when the page loads
 const xhr = new XMLHttpRequest();
 xhr.open("GET", "/static/list_object.json", true); // Adjust the path to your file
 xhr.onload = function () {
  if (xhr.status >= 200 && xhr.status < 300) {
   const data = JSON.parse(xhr.responseText);
   suggestions = data.suggestions; // Store the suggestions in the array
  } else {
   console.error("Error loading suggestions:", xhr.statusText);
  }
 };
 xhr.onerror = function () {
  console.error("Network error");
 };
 xhr.send();
}

function filterSuggestions(query) {
 // Filter suggestions based on the query
 if (!query) {
  return [];
 }
 return suggestions.filter((suggestion) =>
  suggestion.toLowerCase().startsWith(query.toLowerCase())
 );
}

function displaySuggestions(filteredSuggestions) {
 // Display suggestions
 suggestionsBox.innerHTML = ""; // Clear previous suggestions
 if (filteredSuggestions.length === 0) {
  suggestionsBox.style.display = "none"; // Hide suggestions box if no results
  return;
 }
 filteredSuggestions.forEach((suggestion) => {
  const suggestionItem = document.createElement("div");
  suggestionItem.textContent = suggestion;
  suggestionItem.classList.add("suggestion-item");
  suggestionItem.addEventListener("click", () => {
   // On clicking a suggestion
   if (!selectedItems.includes(suggestion)) {
    selectedItems.push(suggestion);
    displaySelectedItems(); // Display selected items
   }
   search1Input.value = ""; // Clear search input
   suggestionsBox.style.display = "none"; // Hide suggestions box
  });
  suggestionsBox.appendChild(suggestionItem);
 });
 suggestionsBox.style.display = "block"; // Show suggestions box when there are results
}

function displaySelectedItems() {
 // Display selected items
 selectedItemsContainer.innerHTML = ""; // Clear previous selections
 selectedItems.forEach((item) => {
  const selectedItemDiv = document.createElement("div");
  selectedItemDiv.classList.add("selected-item");
  selectedItemDiv.textContent = item;
  const removeBtn = document.createElement("span");
  removeBtn.textContent = "x";
  removeBtn.classList.add("remove-btn");
  removeBtn.addEventListener("click", () => {
   selectedItems = selectedItems.filter((selected) => selected !== item);
   displaySelectedItems(); // Refresh selected items display
  });
  selectedItemDiv.appendChild(removeBtn);
  selectedItemsContainer.appendChild(selectedItemDiv);
 });
}

search1Input.addEventListener("input", () => {
 // Event listener for search input
 const query = search1Input.value;
 const filteredSuggestions = filterSuggestions(query);
 displaySuggestions(filteredSuggestions);
});

document.addEventListener("click", (event) => {
 // Hide suggestions box when clicking outside
 if (
  !search1Input.contains(event.target) &&
  !suggestionsBox.contains(event.target)
 ) {
  suggestionsBox.style.display = "none";
 }
});

submitBtn.addEventListener("click", function () {
 // Handle form submission
 document.getElementById("selected-items-input").value =
  selectedItems.join(", "); // Gắn các mục đã chọn vào input ẩn trước khi submit form
});

loadSuggestions(); // Call loadSuggestions when the page loads
