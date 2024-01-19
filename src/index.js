let explorerData = [];
const parentContainer = document.querySelector(".parentContainer");
const parentFolder = document.getElementById("parentFolder");
const parentFile = document.getElementById("parentFile");

parentFolder.addEventListener("click", () => {
  const item = createItemInput(explorerData, parentContainer, null, true);
  parentContainer.appendChild(item);
});

parentFile.addEventListener("click", () => {
  const item = createItemInput(explorerData, parentContainer, "file", true);

  parentContainer.appendChild(item);
});

function createFolderOrFileElement(item, type = null, isFirstLevel) {
  const explorerDiv = document.createElement("div");
  explorerDiv.className = "item";
  if (isFirstLevel) {
    explorerDiv.style.marginLeft = type === "file" && "30px";
  } else {
    explorerDiv.style.marginLeft = type === "file" ? "60px" : "30px";
  }
  if (type === "file") {
    explorerDiv.innerHTML = `
    <div class="container">
      <div class="file-info">
        <img src="/asset/file.svg" alt="file" class="file" />
        <p>${item.text}</p>
      </div>
      <div class="action">
        <img src="/asset/edit.svg" alt="edit" class="edit-btn"/>
        <img src="/asset/delete.svg" alt="delete" class="delete-btn" />
      </div>
    </div>
    `;
  } else {
    explorerDiv.innerHTML = `
    <div class="container">
      <div class="folder-info">
        <img src="/asset/arrow-up.svg" alt="arrow" class="arrow" id="up" />
        <img src="/asset/folder.svg" alt="folder" class="folder" />
        <p>${item.text}</p>
      </div>

      <div class="action">
        <img src="/asset/folder-add.svg" alt="folder" class="addFolder" />
        <img src="/asset/file-add.svg" alt="file" class="addFile" />
        <img src="/asset/edit.svg" alt="edit" class="edit-btn" />
        <img src="/asset/delete.svg" alt="delete" class="delete-btn" />
      </div>
    </div>
    <div class="items-container"></div>
    `;
  }
  const itemsContainer = explorerDiv.querySelector(".items-container");
  const arrow = explorerDiv.querySelector(".arrow");
  const folderInfo = explorerDiv.querySelector(".folder-info");

  folderInfo?.addEventListener("click", () => {
    if (itemsContainer.style.display === "none") {
      arrow.src = "/asset/arrow-down.svg";
      itemsContainer.style.display = "block";
    } else {
      arrow.src = "/asset/arrow-up.svg";
      itemsContainer.style.display = "none";
    }
  });

  const addFolderBtn = explorerDiv?.querySelector(".addFolder");
  addFolderBtn?.addEventListener("click", () => {
    arrow.src = "/asset/arrow-down.svg";
    explorerDiv
      .querySelector(".items-container")
      .appendChild(createItemInput(item, explorerDiv));
  });

  const addFileBtn = explorerDiv?.querySelector(".addFile");
  console.log({ addFileBtn });
  addFileBtn?.addEventListener("click", () => {
    arrow.src = "/asset/arrow-down.svg";
    explorerDiv
      .querySelector(".items-container")
      .appendChild(createItemInput(item, explorerDiv, "file"));
  });

  const editBtn = explorerDiv.querySelector(".edit-btn");
  editBtn.addEventListener("click", () => {
    if (document.querySelector(".save-btn")) {
      document.querySelector(".save-btn").remove();
      document.querySelector(".cancle-btn").remove();
    }
    let saveBtn = document.createElement("button");
    let cancleBtn = document.createElement("button");
    saveBtn.classList.add("save-btn");
    saveBtn.textContent = "Save";
    cancleBtn.classList.add("cancle-btn");
    cancleBtn.textContent = "cancle";
    explorerDiv.insertBefore(saveBtn, itemsContainer);
    explorerDiv.insertBefore(cancleBtn, itemsContainer);
    let itemName = explorerDiv.querySelector("p");
    itemName.contentEditable = true;
    itemName.focus();

    cancleBtn.addEventListener("click", () => {
      explorerDiv.removeChild(cancleBtn);
      explorerDiv.removeChild(saveBtn);
      itemName.contentEditable = false;
      itemName.textContent = item.text;
    });
    saveBtn.addEventListener("click", () => {
      item.text = itemName.textContent;
      explorerDiv.removeChild(cancleBtn);
      explorerDiv.removeChild(saveBtn);
      itemName.contentEditable = false;
    });
  });
  const deleteBtn = explorerDiv.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
    explorerDiv.remove();
  });
  return explorerDiv;
}

function createItemInput(item, parentContainer, type, isFirstLevel) {
  if (document.querySelector(".createItemContainer")) {
    document.querySelector(".createItemContainer").remove();
  }
  const itemInput = document.createElement("input");
  itemInput.type = "text";
  itemInput.placeholder = type === "file" ? "file name..." : "folder name...";

  const addButton = document.createElement("button");
  addButton.textContent = type === "file" ? "Add file" : "Add folder";
  const cancleButton = document.createElement("button");
  cancleButton.textContent = "Cancle";

  const createItemContainer = document.createElement("div");
  createItemContainer.className = "createItemContainer";
  createItemContainer.appendChild(itemInput);
  createItemContainer.appendChild(addButton);
  createItemContainer.appendChild(cancleButton);
  createItemContainer.style.marginLeft = !isFirstLevel && "20px";

  addButton.addEventListener("click", () => {
    const itemText = itemInput.value.trim();
    if (itemText) {
      const newItem =
        type === "file"
          ? { id: Date.now(), text: itemText }
          : { id: Date.now(), text: itemText, items: [] };

      isFirstLevel ? item.push(newItem) : item.items.push(newItem);
      createItemContainer.remove();
      if (isFirstLevel) {
        parentContainer.appendChild(
          createFolderOrFileElement(
            newItem,
            type === "file" && "file",
            isFirstLevel
          )
        );
      } else {
        parentContainer
          .querySelector(".items-container")
          .appendChild(
            createFolderOrFileElement(newItem, type === "file" && "file")
          );
      }
    }
  });

  cancleButton.addEventListener("click", () => {
    createItemContainer.remove();
  });
  return createItemContainer;
}
