document.getElementById('encryptBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    if (!fileInput.files[0]) return alert('Pilih file terlebih dahulu!');
  
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
  
    try {
      const response = await fetch('/encrypt', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
  
      if (result.success) {
        document.getElementById('encryptResult').innerHTML = `
          <p>File berhasil dienkripsi!</p>
          <p>File tersimpan di: ${result.encryptedFile}</p>
        `;
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  });
  
  document.getElementById('decryptBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('encryptedFileInput');
    if (!fileInput.files[0]) return alert('Pilih file terenkripsi!');
  
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const response = await fetch('/decrypt', {
          method: 'POST',
          body: e.target.result,
          headers: {
            'Content-Type': 'text/plain'
          }
        });
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = url;
        downloadLink.download = fileInput.files[0].name.replace('.enc', '');
        downloadLink.style.display = 'block';
        downloadLink.click();
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    };
    reader.readAsText(fileInput.files[0]);
  });