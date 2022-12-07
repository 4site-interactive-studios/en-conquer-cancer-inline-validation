window.addEventListener("load", () => {
  document
    .querySelectorAll(
      "form.en__component .en__field__input, .en__ecardmessage textarea[name='transaction.comments'], .en__ecardrecipients__detail input"
    )
    .forEach((input) => {
      if (input.classList.contains("en__field__input--select")) {
        return;
      }

      // Validate fields that are filled on page load
      if (input.value != "") {
        validateInput(true, input, false);
      }

      // Detect autofilled fields
      input.addEventListener("change", (e) => {
        setTimeout(() => {
          if (
            e.target.value != "" &&
            getComputedStyle(e.target).backgroundColor != "rgb(254, 254, 254)"
          ) {
            e.target.classList.remove("input-invalid");
            e.target.parentElement.querySelector(".invalid-text")?.remove();
            e.target.parentElement.classList.add("autofilled-input-valid");

            if (e.target == document.activeElement) {
              e.target.parentElement.classList.add("selected-autofill-field");
            }
          } else {
            e.target.parentElement.classList.remove("autofilled-input-valid");
          }
        }, 300);
      });

      input.addEventListener("focusout", (e) => {
        const targetNode = e.target;
        const parent = e.target.parentElement;
        const required =
          parent.parentElement.classList.contains("en__mandatory") ||
          parent.classList.contains("en__ecardmessage") ||
          parent.parentElement.classList.contains(
            "en__ecardrecipients__detail"
          );
        const inputType = targetNode.name.split(".")[1];

        // Ignore input if form was just autofilled
        if (
          targetNode.parentElement.classList.contains("selected-autofill-field")
        ) {
          targetNode.parentElement.classList.remove("selected-autofill-field");
          return;
        }

        if (!required && targetNode.value == "") {
          targetNode.classList.remove("input-valid");
          targetNode.parentElement.classList.remove("autofilled-input-valid");
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
          const inputValid = inputValid && phoneRegex.test(targetNode.value);
          validateInput(inputValid, targetNode, required);
        } else if (
          inputType == "emailAddress" ||
          targetNode.parentElement.classList.contains(
            "en__ecardrecipients__email"
          )
        ) {
          const emailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ms);
          const inputValid =
            targetNode.value != "" && emailRegex.test(targetNode.value);
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
            input.parentElement.classList.remove("autofilled-input-valid");
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
  if (
    node.parentElement.classList.contains("autofilled-input-valid") &&
    getComputedStyle(node).backgroundColor != "rgb(254, 254, 254)"
  ) {
    return;
  }

  node.parentElement.classList.remove("autofilled-input-valid");

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
