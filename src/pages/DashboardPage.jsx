import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import Modal from '../components/Modal.jsx';
import Toast from '../components/Toast.jsx';
import './Dashboard.css';

// Helper function from your code
function wordArrayToUint8Array(wordArray) {
  const l = wordArray.sigBytes;
  const u8_array = new Uint8Array(l);
  const words = wordArray.words;
  for (let i = 0; i < l; i++) {
    const j = i >>> 2;
    const k = (3 - (i & 3)) << 3;
    u8_array[i] = (words[j] >>> k) & 0xff;
  }
  return u8_array;
}

const DashboardPage = () => {
  // --- NEW STATE FOR MASTER KEY WORKFLOW ---
  const [isLoading, setIsLoading] = useState(true);
  const [hasEncryptionKey, setHasEncryptionKey] = useState(false);
  const [sessionEncryptionKey, setSessionEncryptionKey] = useState(null);
  const [encryptionKeyFields, setEncryptionKeyFields] = useState({ key: '', oldKey: '', newKey: '' });

  // --- EXISTING STATE ---
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [modalState, setModalState] = useState({ isOpen: false, type: null, props: {} });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [passwordFields, setPasswordFields] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [toastInfo, setToastInfo] = useState({ show: false, message: '', type: 'error' });
  const [editingFileId, setEditingFileId] = useState(null);
  const [newFileName, setNewFileName] = useState('');

  const token = localStorage.getItem('token');
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = useCallback(async () => {
    if (!token) { navigate('/login'); return; }
    setIsLoading(true);
    try {
      const [filesRes, keyStatusRes] = await Promise.all([
        axios.get('http://localhost:3001/api/files', authHeaders),
        axios.get('http://localhost:3001/api/encryption/status', authHeaders)
      ]);
      setFiles(filesRes.data.data);
      setHasEncryptionKey(keyStatusRes.data.hasKey);
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
      if (error.response?.status === 401) navigate('/login');
    } finally {
      setIsLoading(false);
    }
  }, [navigate, token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const closeModal = () => {
    setModalState({ isOpen: false, type: null, props: {} });
    setEncryptionKeyFields({ key: '', oldKey: '', newKey: '' });
    setPasswordFields({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // --- NEW MASTER KEY HANDLERS ---
  const handleSetKey = async (e) => {
    e.preventDefault();
    const { key } = encryptionKeyFields;
    if (key.length < 6) { setToastInfo({ show: true, message: 'Key must be at least 6 characters.', type: 'error' }); return; }
    try {
      const res = await axios.post('http://localhost:3001/api/encryption/set-key', { key }, authHeaders);
      setToastInfo({ show: true, message: res.data.message, type: 'success' });
      setHasEncryptionKey(true);
      setSessionEncryptionKey(key);
      closeModal();
    } catch (error) {
      setToastInfo({ show: true, message: error.response?.data?.message || 'Failed to set key.', type: 'error' });
    }
  };

  const handleChangeEncryptionKey = async (e) => {
    e.preventDefault();
    const { oldKey, newKey } = encryptionKeyFields;
    if (newKey.length < 6) { setToastInfo({ show: true, message: 'New key must be at least 6 characters.', type: 'error' }); return; }
    try {
      const res = await axios.post('http://localhost:3001/api/encryption/change-key', { oldKey, newKey }, authHeaders);
      setToastInfo({ show: true, message: res.data.message, type: 'success' });
      setSessionEncryptionKey(newKey);
      closeModal();
    } catch (error) {
      setToastInfo({ show: true, message: error.response?.data?.message || 'Failed to change key.', type: 'error' });
    }
  };

  const handleVerifyKeyAndProceed = async (e, onVerifiedCallback) => {
    e.preventDefault();
    const { key } = encryptionKeyFields;
    try {
      await axios.post('http://localhost:3001/api/encryption/verify-key', { key }, authHeaders);
      setSessionEncryptionKey(key);
      closeModal();
      onVerifiedCallback(key);
    } catch (error) {
      setToastInfo({ show: true, message: error.response?.data?.message || 'Invalid key.', type: 'error' });
    }
  };

  const handleAccountResetSubmit = async (e) => {
    e.preventDefault();
    const accountPassword = e.target.elements.accountPassword.value;
    try {
      const res = await axios.post('http://localhost:3001/api/encryption/reset-account', { accountPassword }, authHeaders);
      setToastInfo({ show: true, message: res.data.message, type: 'success' });
      closeModal();
      fetchData();
    } catch (error) {
      setToastInfo({ show: true, message: error.response?.data?.message || 'Failed to reset account.', type: 'error' });
    }
  };

  // --- UPDATED FILE HANDLERS to use Master Key ---
  const handleFileUpload = (event) => {
    event.preventDefault();
    if (!selectedFile) return;
    const performUpload = (key) => {
      setMessage(`Uploading "${selectedFile.name}"...`);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileContent = CryptoJS.lib.WordArray.create(e.target.result);
        const encryptedContent = CryptoJS.AES.encrypt(fileContent, key).toString();
        const encryptedFile = new Blob([encryptedContent]);
        const formData = new FormData();
        formData.append('file', encryptedFile, selectedFile.name);
        try {
          await axios.post('http://localhost:3001/api/files/upload', formData, { ...authHeaders, 'Content-Type': 'multipart/form-data', onUploadProgress: (p) => setUploadProgress(Math.round((p.loaded * 100) / p.total)) });
          setToastInfo({ show: true, message: 'File uploaded successfully!', type: 'success' });
          fetchData();
        } catch (error) {
          setToastInfo({ show: true, message: 'File upload failed.', type: 'error' });
        } finally {
          setSelectedFile(null);
          document.getElementById('file-input').value = null;
          setTimeout(() => { setUploadProgress(0); setMessage(''); }, 2000);
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    };
    if (sessionEncryptionKey) { performUpload(sessionEncryptionKey); } 
    else { setModalState({ isOpen: true, type: 'enterKey', props: { onConfirm: performUpload, title: "Enter Master Key to Upload" } }); }
  };

  const handleFileDownload = (fileId, fileName) => {
    const performDownload = async (key) => {
      try {
        const res = await axios.get(`http://localhost:3001/api/files/${fileId}/download`, authHeaders);
        const response = await axios.get(res.data.url, { responseType: 'text' });
        const decryptedBytes = CryptoJS.AES.decrypt(response.data, key);
        if (!decryptedBytes || decryptedBytes.sigBytes <= 0) throw new Error("Decryption failed. The key may be incorrect.");
        const blob = new Blob([wordArrayToUint8Array(decryptedBytes)], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = fileName;
        document.body.appendChild(a); a.click(); a.remove(); window.URL.revokeObjectURL(url);
      } catch (error) {
        setToastInfo({ show: true, message: error.message || 'Download failed.', type: 'error' });
      }
    };
    setModalState({ isOpen: true, type: 'enterKey', props: { onConfirm: performDownload, title: "Enter Master Key to Download" } });
  };

  const handleFileDelete = (fileId, fileName) => {
    setModalState({ isOpen: true, type: 'confirmDelete', props: { fileName, onConfirm: () => handleDeleteConfirm(fileId, fileName) } });
  };

  const handleDeleteConfirm = async (fileId, fileName) => {
    closeModal();
    try {
      await axios.delete(`http://localhost:3001/api/files/${fileId}`, authHeaders);
      setToastInfo({ show: true, message: `File "${fileName}" deleted successfully.`, type: 'success' });
      fetchData();
    } catch (error) {
      setToastInfo({ show: true, message: 'Failed to delete file.', type: 'error' });
    }
  };

  // --- EXISTING UNCHANGED HANDLERS ---
  const handleOpenChangePasswordModal = () => setModalState({ isOpen: true, type: 'changePassword' });
  const handleChangePasswordSubmit = async (event) => {
    event.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordFields;
    if (newPassword !== confirmPassword) { setToastInfo({ show: true, message: "New passwords do not match.", type: 'error' }); return; }
    if (!newPassword || newPassword.length < 6) { setToastInfo({ show: true, message: "Password must be at least 6 characters.", type: 'error' }); return; }
    try {
      const response = await axios.post('http://localhost:3001/api/auth/change-password', { currentPassword, newPassword }, authHeaders);
      setToastInfo({ show: true, message: response.data.message, type: 'success' });
      closeModal();
    } catch (error) {
      setToastInfo({ show: true, message: error.response?.data?.message || 'Failed to change password.', type: 'error' });
    }
  };
  const handleRenameClick = (file) => {
    setEditingFileId(file._id);
    const nameParts = file.fileName.split('.');
    if (nameParts.length > 1) { nameParts.pop(); }
    setNewFileName(nameParts.join('.'));
  };
  const handleRenameSubmit = async (e, originalFile) => {
    e.preventDefault();
    const nameParts = originalFile.fileName.split('.');
    const extension = nameParts.length > 1 ? `.${nameParts.pop()}` : '';
    let newBaseName = newFileName;
    if (!newBaseName.trim()) { setToastInfo({ show: true, message: 'File name cannot be empty.', type: 'error' }); setEditingFileId(null); return; }
    const finalNewName = newBaseName.trim() + extension;
    try {
      await axios.put(`http://localhost:3001/api/files/${originalFile._id}/rename`, { newName: finalNewName }, authHeaders);
      setToastInfo({ show: true, message: 'File renamed successfully!', type: 'success' });
      setEditingFileId(null);
      fetchData();
    } catch (error) {
      setToastInfo({ show: true, message: 'Failed to rename file.', type: 'error' });
      setEditingFileId(null);
    }
  };
  const performLogout = () => { localStorage.removeItem('token'); navigate('/login'); };
  const handleLogoutClick = () => setModalState({ isOpen: true, type: 'confirmLogout', props: { onConfirm: performLogout } });


  // --- RENDER LOGIC ---
  if (isLoading) { return <div className="dashboard-container flex items-center justify-center text-white">Loading Your Secure Vault...</div>; }

  if (!hasEncryptionKey) {
    return (
      <div className="dashboard-container">
        <Toast show={toastInfo.show} message={toastInfo.message} type={toastInfo.type} onDismiss={() => setToastInfo({ ...toastInfo, show: false })} />
        <Modal isOpen={true} modalClassName="modal-glass">
          <form onSubmit={handleSetKey}>
            <h3 className="panel-title mb-4">Set Your Master Encryption Key</h3>
            <p className="text-sm text-gray-400 mb-6">This password will encrypt and decrypt all your files. **It cannot be recovered if you forget it.** Please store it safely.</p>
            <input type="password" placeholder="Enter new encryption key (min. 6 chars)" value={encryptionKeyFields.key} onChange={(e) => setEncryptionKeyFields({ ...encryptionKeyFields, key: e.target.value })} className="w-full px-3 py-2 rounded-md mb-4" required autoFocus />
            <div className="flex justify-end"><button type="submit" className="btn-gradient">Set & Continue</button></div>
          </form>
        </Modal>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-background"><div className="gradient-sphere sphere-1"></div><div className="gradient-sphere sphere-2"></div></div>
      <Toast show={toastInfo.show} message={toastInfo.message} type={toastInfo.type} onDismiss={() => setToastInfo({ ...toastInfo, show: false })} />
      <nav className="dashboard-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="dashboard-logo">CloudStore</Link>
            <div className="flex items-center space-x-4">
              <button onClick={() => setModalState({ isOpen: true, type: 'changeKey' })} className="nav-btn">Change Encryption Key</button>
              <button onClick={handleOpenChangePasswordModal} className="nav-btn">Change Account Password</button>
              <button onClick={handleLogoutClick} className="nav-btn nav-btn-logout">Logout</button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-8">
          <div className="glass-panel"><h3 className="panel-title">Upload a New File</h3><form onSubmit={handleFileUpload} className="flex items-center space-x-4"><input id="file-input" type="file" onChange={(e) => setSelectedFile(e.target.files[0])} className="file-input-themed w-full text-sm" /><button type="submit" className="btn-gradient whitespace-nowrap">Encrypt & Upload</button></form>{message && <p className="mt-4 text-sm text-gray-400">{message}</p>}{uploadProgress > 0 && (<div className="w-full bg-gray-700 rounded-full h-2.5 mt-4"><div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div></div>)}</div>
          <div className="glass-panel"><h3 className="panel-title">Your Stored Files</h3><div className="overflow-x-auto">{files.length > 0 ? (<ul>{files.map((file) => (<li key={file._id} className="file-list-item"><div className="flex-grow">{editingFileId === file._id ? (<form onSubmit={(e) => handleRenameSubmit(e, file)} className="flex items-center"><input type="text" value={newFileName} onChange={(e) => setNewFileName(e.target.value)} className="flex-grow px-2 py-1 bg-gray-700 border border-blue-500 rounded-md text-white" autoFocus onBlur={() => setEditingFileId(null)} />{file.fileName.includes('.') && <span className="pl-1 text-gray-400">.{file.fileName.split('.').pop()}</span>}</form>) : (<span className="file-name break-all">{file.fileName}</span>)}</div><div className="flex items-center space-x-2 flex-shrink-0"><span className="file-date">{new Date(file.createdAt).toLocaleDateString()}</span><button onClick={() => handleRenameClick(file)} className="btn-action btn-rename">Rename</button><button onClick={() => handleFileDownload(file._id, file.fileName)} className="btn-action btn-download">Download</button><button onClick={() => handleFileDelete(file._id, file.fileName)} className="btn-action btn-delete">Delete</button></div></li>))}</ul>) : (<p className="text-center text-gray-400 py-4">You haven't uploaded any files yet.</p>)}</div></div>
        </div>
      </main>

      <Modal isOpen={modalState.isOpen} onClose={closeModal} modalClassName="modal-glass">
        <button onClick={closeModal} className="modal-close-btn"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
        
        {modalState.type === 'enterKey' && (<form onSubmit={(e) => handleVerifyKeyAndProceed(e, modalState.props.onConfirm)}><h3 className="panel-title mb-4">{modalState.props.title || 'Master Key Required'}</h3><p className="text-sm text-gray-400 mb-4">Please enter your master encryption key to proceed.</p><input name="key" type="password" value={encryptionKeyFields.key} onChange={(e) => setEncryptionKeyFields({ ...encryptionKeyFields, key: e.target.value })} className="w-full px-3 py-2 rounded-md mb-4" autoFocus required /><div className="flex justify-between items-center mt-4"><button type="button" onClick={() => setModalState({ isOpen: true, type: 'confirmReset' })} className="font-medium text-red-400 hover:underline text-sm">Forgot key? Reset account.</button><div className="flex space-x-4"><button type="button" onClick={closeModal} className="nav-btn">Cancel</button><button type="submit" className="btn-gradient">Confirm</button></div></div></form>)}
        
        {modalState.type === 'changeKey' && (<form onSubmit={handleChangeEncryptionKey}><h3 className="panel-title mb-4">Change Master Encryption Key</h3><div className="space-y-4"><input type="password" placeholder="Old Encryption Key" value={encryptionKeyFields.oldKey} onChange={(e) => setEncryptionKeyFields({ ...encryptionKeyFields, oldKey: e.target.value })} className="w-full px-3 py-2 rounded-md" required autoFocus /><input type="password" placeholder="New Encryption Key (min. 6 chars)" value={encryptionKeyFields.newKey} onChange={(e) => setEncryptionKeyFields({ ...encryptionKeyFields, newKey: e.target.value })} className="w-full px-3 py-2 rounded-md" required /></div><div className="flex justify-end space-x-4 mt-6"><button type="button" onClick={closeModal} className="nav-btn">Cancel</button><button type="submit" className="btn-gradient">Update Key</button></div></form>)}
        
        {modalState.type === 'confirmReset' && (<form onSubmit={handleAccountResetSubmit}><h3 className="panel-title text-red-500 mb-4">Account Reset Confirmation</h3><p className="text-gray-300 mb-2">This is your final warning. If you proceed:</p><ul className="list-disc list-inside mb-4 text-red-400"><li>All of your encrypted files will be permanently deleted.</li><li>This action cannot be undone.</li></ul><p className="text-gray-400 mb-4">To confirm, please enter your main <strong>account password</strong> (the one you use to log in).</p><input name="accountPassword" type="password" className="w-full px-3 py-2 rounded-md mb-4" required autoFocus /><div className="flex justify-end space-x-4"><button type="button" onClick={closeModal} className="nav-btn">Cancel</button><button type="submit" className="btn-action btn-delete">Delete All Files & Reset</button></div></form>)}

        {modalState.type === 'changePassword' && (<form onSubmit={handleChangePasswordSubmit}><h3 className="panel-title mb-4">Change Account Password</h3><div className="space-y-4"><input type="password" placeholder="Current Account Password" value={passwordFields.currentPassword} onChange={(e) => setPasswordFields({ ...passwordFields, currentPassword: e.target.value })} className="w-full px-3 py-2 rounded-md" required autoFocus /><input type="password" placeholder="New Account Password" value={passwordFields.newPassword} onChange={(e) => setPasswordFields({ ...passwordFields, newPassword: e.target.value })} className="w-full px-3 py-2 rounded-md" required /><input type="password" placeholder="Confirm New Password" value={passwordFields.confirmPassword} onChange={(e) => setPasswordFields({ ...passwordFields, confirmPassword: e.target.value })} className="w-full px-3 py-2 rounded-md" required /></div><div className="flex justify-end space-x-4 mt-6"><button type="button" onClick={closeModal} className="nav-btn">Cancel</button><button type="submit" className="btn-gradient">Update Password</button></div></form>)}
        
        {modalState.type === 'confirmLogout' && (<div><h3 className="panel-title mb-4">Confirm Logout</h3><p className="text-sm text-gray-400 mb-6">Are you sure you want to log out?</p><div className="flex justify-end space-x-4"><button onClick={closeModal} className="nav-btn">Cancel</button><button onClick={modalState.props.onConfirm} className="nav-btn nav-btn-logout">Logout</button></div></div>)}
        
        {modalState.type === 'confirmDelete' && (<div><h3 className="panel-title mb-4">Confirm Deletion</h3><p className="text-sm text-gray-400 mb-4">Are you sure you want to permanently delete "{modalState.props.fileName}"?</p><div className="flex justify-end space-x-4"><button onClick={closeModal} className="nav-btn">Cancel</button><button onClick={modalState.props.onConfirm} className="btn-action btn-delete">Delete</button></div></div>)}
      </Modal>
    </div>
  );
};

export default DashboardPage;
