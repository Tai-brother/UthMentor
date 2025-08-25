// Clear Storage Utility Script
// Run this in browser console to clear all stored data

console.log("🧹 Clearing browser storage...");

// Clear localStorage
localStorage.clear();
console.log("✅ localStorage cleared");

// Clear sessionStorage
sessionStorage.clear();
console.log("✅ sessionStorage cleared");

// Clear cookies (if any)
document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});
console.log("✅ Cookies cleared");

// Verify storage is empty
console.log("📋 Storage status:");
console.log("- localStorage length:", localStorage.length);
console.log("- sessionStorage length:", sessionStorage.length);
console.log("- Cookies:", document.cookie);

console.log("🎉 Storage cleared successfully!");
console.log("💡 Now try logging in again with: hoainam001 / 123456"); 