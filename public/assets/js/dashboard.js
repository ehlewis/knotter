

function addCards(){
  for (i = 0; i < 3; i++){
    var new_card = document.createElement('div');
    new_card.innerHTML = '<div class="content">\
      <div class="card">\
        <div class="card-content">\
          <div class="bank-logo">\
            <img src="assets/graphics/BoACardLogo.svg">\
        </div>\
          <div class="info">\
            <div class="balance">\
              <p> Current balance: </p>\
              <h2> $50 </h2>\
              <hr>\
              <p> Credit remaining: </p>\
              <h2> $1000 </h2>\
            </div>\
          </div>\
          <div class="transactions" id="style-1">\
            <table>\
              <tr>\
                <th>Company</th>\
                <th>Contact</th>\
                <th>Country</th>\
              </tr>\
              <tr>\
                <td>Alfreds Futterkiste</td>\
                <td>Maria Anders</td>\
                <td>Germany</td>\
              </tr>\
              <tr>\
                <td>Centro comercial Moctezuma</td>\
                <td>Francisco Chang</td>\
                <td>Mexico</td>\
              </tr>\
              <tr>\
                <td>Ernst Handel</td>\
                <td>Roland Mendel</td>\
                <td>Austria</td>\
              </tr>\
              <tr>\
                <td>Island Trading</td>\
                <td>Helen Bennett</td>\
                <td>UK</td>\
              </tr>\
              <tr>\
                <td>Alfreds Futterkiste</td>\
                <td>Maria Anders</td>\
                <td>Germany</td>\
              </tr>\
              <tr>\
                <td>Centro comercial Moctezuma</td>\
                <td>Francisco Chang</td>\
                <td>Mexico</td>\
              </tr>\
              <tr>\
                <td>Ernst Handel</td>\
                <td>Roland Mendel</td>\
                <td>Austria</td>\
              </tr>\
              <tr>\
                <td>Island Trading</td>\
                <td>Helen Bennett</td>\
                <td>UK</td>\
              </tr>\
              <tr>\
                <td>Alfreds Futterkiste</td>\
                <td>Maria Anders</td>\
                <td>Germany</td>\
              </tr>\
              <tr>\
                <td>Centro comercial Moctezuma</td>\
                <td>Francisco Chang</td>\
                <td>Mexico</td>\
              </tr>\
              <tr>\
                <td>Ernst Handel</td>\
                <td>Roland Mendel</td>\
                <td>Austria</td>\
              </tr>\
              <tr>\
                <td>Island Trading</td>\
                <td>Helen Bennett</td>\
                <td>UK</td>\
              </tr>\
            </table>\
          </div>\
        </div>\
      </div>'

      document.getElementById('container_block').appendChild(new_card);
  }
}
