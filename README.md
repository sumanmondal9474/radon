# Open-to-Intern-Project
const logoLinkValidator = (/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g).test(logoLink)
            if (!logoLinkValidator) {
                return res.status(400).send({ status: false, message: "Please enter a valid logo link " })
            }
