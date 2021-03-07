var username = window.location.host.split('.')[0];
var path = window.location.pathname;

async function fetchTree() {
  var url = 'https://api.github.com/repos/' +
    `${username}/${username}.github.io/contents${path}`;

  return await fetch(url);
}

function makeFileItem(file) {
  var type = 'file';
  if (file.type === 'dir') {
    type = 'folder';
  }
  var path = '/' + file.path;
  return `<tr>
    <td><div class="file-icon ${type}"></div></td>
    <td><a href="${path}">${file.name}</a></td>
    <td>${file.size}</td>
</tr>
`;
}

function makeFileList(indexText, files) {
  var fileList = '';
  files.forEach(file => {
    fileList += makeFileItem(file);
  });

  return `
    <h1>${indexText}</h1>
    <table>
    <tr>
        <td></td>
        <td>Name</td>
        <td>Size</td>
    </tr>
    <tr>
        <th colspan="3"><hr></th>
    </tr>
    ${fileList}
    <tr>
        <th colspan="3"><hr></th>
    </tr>
    </table>
`;
}

async function main() {
  var resp = await fetchTree();
  if (resp.status === 404) {
    document.title = '404 Not Found';
    document.body.innerHTML = `
    <center><h1>404 Not Found</h1></center>
    <hr><center>${username}</center>
    `;
    return;
  } else if (resp.status === 200) {
    var indexText = `Index of ${path}`;
    document.title = indexText;
    var files = await resp.json();
    document.body.innerHTML = makeFileList(indexText, files);
  }
}

main();
