$(() => {

    const MESSAGE_WITHOUT_USERS = "Nenhum usuário válido encontrado."
    const MESSAGE_WITHOUT_REPOS = "Este usuário não possui repositórios públicos."

    $(document).ready(() => {

        $("#github-users option").each(async (index, option) => {

            $('#message').hide()

            if (index != 0) {
                var user = $(option).val()
                const response = await getUser(user)

                if (!response.isValid) {
                    $(option).remove()
                }
            }

            if ($("#github-users option").length == 1)
                showMessage(MESSAGE_WITHOUT_USERS)

        })
    })

    $("#github-users").on("change", async () => {

        $('#message').hide()

        var selectedValue = $("#github-users option:selected").val();

        if (selectedValue == "") {
            $('.second-section').hide()
            return
        }

        var user = await getUser(selectedValue)
        var repositories = await getRepositories(selectedValue)

        user.avatar ? $("#avatar-user").attr("src", user.avatar).show() : $("#avatar-user").hide()
        user.name ? $("#name-user").text(user.name).show() : $("#name-user").hide()
        user.nickname ? $("#nickname-user").text(user.nickname).show() : $("#user.nickname").hide()
        user.url ? $("#url-user").attr("href", user.url).text(user.url).show() : $("#url-user").hide()

        $('.second-section').show()
    })

    async function getUser(user) {
        const response = await fetch(`https://api.github.com/users/${user}`, { method: 'GET' })
        const result = await response.json()

        if (!result.id)
            return {
                isValid: false
            }

        return {
            isValid: true,
            avatar: result.avatar_url,
            name: result.name,
            nickname: result.login,
            url: result.html_url
        }
    }

    function getRepositories(user) {
        $.get(`https://api.github.com/users/${user}/repos`, (data) => {

            if (data.length == 0) {
                $('.container-table').hide()
                showMessage(MESSAGE_WITHOUT_REPOS)
                return
            }

            $('.container-table').show()
            $('#table-repositories').DataTable({
                destroy: true,
                data,
                columns: [
                    { data: 'name' },
                    { data: 'description' },
                    { data: 'language' },
                    {
                        data: 'html_url', fnCreatedCell: (nTd, sData, oData, iRow, iCol) => {
                            $(nTd).html(`<a href="${oData.html_url}">${oData.html_url}</a>`);
                        }
                    }
                ]
            });

        })
    }

    function showMessage(message) {
        $('#message').text(message)
        $('#message').show()
    }
});

