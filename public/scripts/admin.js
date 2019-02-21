const $ = q => document.querySelector(q);
const make = el => document.createElement(el);
const empty = el => el.innerHTML = "";
const hide = el => el.classList.add('hidden');
const show = el => el.classList.remove('hidden');

const makeAPI = () => {
  // we're going to keep securish data inside this closure
  let token = "";
  let email = "";

  // don't want the general api to handle this, since we want to handle
  // requests internally
  const getAuthed = (url) => {
    return fetch(url, {
      method: "GET",
      headers: {
        "Content-Type":"application/json",
        "Authorization": `Bearer ${token}`
      }
    }).then(r => r.json());
  }
  const postAuthed = (url, body) => {
    return fetch(url,
      {
      method: "POST",
      headers: {
        "Content-Type":"application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(body)
    }).then(r => r.json());
  }
  const putAuthed = (url, body) => {
    return fetch(url,
      {
      method: "PUT",
      headers: {
        "Content-Type":"application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(body)
    }).then(r => r.json());
  }

  // RETURN AN OBJECT WITH ALL THE RESULTS
  return {
    login : (email, password) => {
      // Return the promise
      return fetch('/api/auth/login', {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
          email,
          password
        })
      }).then(response => {
        if(response.status !== 200){
          return Promise.reject(response);
        } else {
          email = email;
          return response.json() // get the completed json request along the way
        }
      }).then(({message}) => {
        //debugger;
        token = message.split(' ')[1];
      }).catch(() => {
        alert("Unable to login, check your credentials and try again");
      })
    },
    logout: () => {
      token = "";
      email = "";
      return Promise.resolve();
    },

    getInvites: () => {
      return getAuthed('/api/admin/invite/all');
    },

    createInvite: email => {
      return postAuthed("/api/admin/invite", {
        email
      }).then(results => {
          console.log(results);
          return Promise.resolve(results);
      });
    },

    getUsers: () => {
      return getAuthed('/api/admin/user');
    },

    validateUser: code => {
      return putAuthed(`/api/admin/user/${code}/validate`, {})
    },
    invalidateUser: code => {
      return putAuthed(`/api/admin/user/${code}/invalidate`, {})
    }
  }
}
const API = makeAPI();

const displayInvites = invites => {
  console.log(invites)
  const displayArea = $("#invites-display");
  empty(displayArea);
  invites.forEach(invite => {
    const row = make("div");
    row.textContent =
    `${invite.invitee_email} - ${invite.code} - ${invite.used ? 'claimed' : 'unclaimed'}`;
    displayArea.append(row);
  })
};

const displayNewInvite = invite => {
  const inviteeCode = $("#invitee-code");
  const inviteeLink = $("#invitee-link");
  empty(inviteeCode);
  empty(inviteeLink);
  inviteeCode.textContent =
  `Code: ${invite.code}`;
  inviteeLink.textContent =
  `${window.location.origin}/claim.html?code=${invite.code}`
}

const displayUsers = users => {
  const userArea = $("#user-container");
  empty(userArea);
  users.forEach(user => {
    const userHTML = make("div");
    const userInfo = make("span");
    let isValid = user.validated;
    userInfo.textContent =
    `${user.email}
    ${user.isAdmin ? " - admin " : ""}
    ${isValid ? " - validated " : " - not validated "}
    `;
    userHTML.append(userInfo);
    // all of this is closured
    if(!user.isAdmin){
      const validButton = make("button");
      validButton.textContent = isValid ? "invalidate" : "validate";
      userHTML.append(validButton);
      // TODO: improve this
      validButton.onclick = () => {
        if(isValid){
          isValid = false;
          API.invalidateUser(user._id);
        } else {
          isValid = true;
          API.validateUser(user._id);
        }
        validButton.textContent = isValid ? "invalidate" : "validate";
        userInfo.textContent =
        `${user.email}
        ${user.isAdmin ? " - admin " : ""}
        ${isValid ? " - validated " : " - not validated "}
        `;
      };
    }

    userArea.append(userHTML);
  });
};

$("#sign-in").onclick = () => {
  const email = $("#email").value;
  const password = $("#password").value;

  API.login(email, password).then(() => {
      $("#email").value = "";
      $("#password").value = "";
      hide($("#login-section"));
      show($("#active-section"));
      $("#loggedInAs").textContent = email;
      API.getInvites().then(results => displayInvites(results));
      API.getUsers().then(results => displayUsers(results));
  });
}
$("#logout").onclick = () => {
  API.logout().then(() => {
      show($("#login-section"));
      hide($("#active-section"));
  });
}
$("#generateInvite").onclick = () => {
  const email = $("#invitee-email").value;
  $("#invitee-email").value = "";
  API.createInvite(email).then(invite => {
    displayNewInvite(invite)
    API.getInvites().then(results => displayInvites(results));
  });
};
