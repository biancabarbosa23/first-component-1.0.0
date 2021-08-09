$(function () {

    $(document).ready(() => {
        $("#github-users option").each(async (index, option) => {

            $('#message').hide()

            if (index != 0) {

                var user = $(option).val()
                const response = await getInfoUser(user)

                if (!response.isValid) {
                    $(option).remove()
                }
            }


            if ($("#github-users option").length == 1) {
                $('#message').text("Nenhum usuário válido encontrado.")
                $('#message').show()
            }
        })
    })

    $("#github-users").on("change", async () => {

        $('#message').hide()

        var selectedValue = $(this).val();
        console.log(selectedValue)

        if (selectedValue == "") {
            $('.second-section').hide()
            return
        }

        var user = await getInfoUser(selectedValue)
        var repositories = await getRepositoriesUser(selectedValue)

        user.avatar ? $("#avatar-user").attr("src", user.avatar).show() : $("#avatar-user").hide()
        user.name ? $("#name-user").text(user.name).show() : $("#name-user").hide()
        user.nickname ? $("#nickname-user").text(`(${user.nickname})`).show() : $("#user.nickname").hide()
        user.url ? $("#url-user").attr("href", user.url).text(user.url).show() : $("#url-user").hide()

        $('.second-section').show()
    })

    async function getInfoUser(user) {
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

    function getRepositoriesUser(user) {
        $.get(`https://api.github.com/users/${user}/repos`, (data) => {

            if (data.length == 0) {

                $('.container-table').hide()
                $('#message').text('Este usuário não possui repositórios públicos')
                $('#message').show()
                return
            }

            $('.container-table').show()
            $('#table-repositories').DataTable({
                destroy: true,
                data: data,
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
});

