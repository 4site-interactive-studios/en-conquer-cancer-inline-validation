window.addEventListener("load", () => {
  document
    .querySelectorAll("form.en__component .en__field__input")
    .forEach((input) => {
      // Validate fields that are filled on page load
      console.log(input.value);
      if (input.value != "") {
        validateInput(true, input, false);
      }

      input.addEventListener("focusout", (e) => {
        const targetNode = e.target;
        const required =
          targetNode.parentElement.parentElement.classList.contains(
            "en__mandatory"
          );
        const inputType = targetNode.name.split(".")[1];

        if (!required && targetNode.value == "") {
          targetNode.classList.remove("input-valid");
          return;
        }

        if (targetNode.type == "date") {
          return;
        }

        // Handle specific vaidation cases
        if (inputType == "phoneNumber") {
          const phoneRegex = new RegExp(
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
          );
          inputValid = inputValid && phoneRegex.test(targetNode.value);
          validateInput(inputValid, targetNode, required);
        } else if (inputType == "emailAddress") {
          const inputValid =
            targetNode.validity.valid && targetNode.value != "";
          validateInput(inputValid, targetNode, required);
        } else if (inputType == "ccnumber") {
          const ccRegex = new RegExp(/^([0-9]{15}|[0-9]{16})$/ms);
          const inputValid = ccRegex.test(targetNode.value);
          validateInput(inputValid, targetNode, required);
        } else if (inputType == "ccvv") {
          const ccvRegex = new RegExp(/^([0-9]{3}|[0-9]{4})$/ms);
          const inputValid = ccvRegex.test(targetNode.value);
          validateInput(inputValid, targetNode, required);
        } else {
          //Handle general validation cases
          const inputValid = (required && targetNode.value != "") || !required;
          validateInput(inputValid, targetNode, required);
        }
      });
    });

  // Remove valid class from input on submit if validation failed
  document.querySelector(".en__submit").addEventListener("click", () => {
    setTimeout(() => {
      document
        .querySelectorAll("form.en__component .en__field__input")
        .forEach((input) => {
          const inputValid =
            !input.parentElement.parentElement.classList.contains(
              "en__field--validationFailed"
            );

          if (!inputValid) {
            input.classList.remove("input-valid");
            input.classList.add("input-invalid");
          }
        });
    }, 400);
  });
});

function addInvalidStyle(node, invalidText = "Invalid input") {
  node.classList.add("input-invalid");
  const oldText = node.parentElement.querySelector(".invalid-text");

  if (oldText) {
    oldText.remove();
  }

  const p = document.createElement("p");
  p.innerText = invalidText;
  p.style.margin = "0";
  p.style.color = "red";
  p.classList.add("invalid-text");
  node.parentElement.appendChild(p);
}

function removeInvalidStyle(node) {
  node.classList.remove("input-invalid");
  const invalidText = node.parentElement.querySelector(".invalid-text");

  if (invalidText) {
    invalidText.remove();
  }
}

function validateInput(valid, node, required) {
  if (!valid) {
    node.classList.remove("input-valid");

    if (required && node.value == "") {
      addInvalidStyle(node, "Required field");
      return;
    }

    addInvalidStyle(node);
  } else if (valid) {
    node.classList.add("input-valid");
    removeInvalidStyle(node);
  }
}
