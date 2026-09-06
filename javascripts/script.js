//--------------------------------------------------------
// Supabase client setup – Setup the connection between client - server
//--------------------------------------------------------
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://iakneqgnrsacfzrplmjf.supabase.co';
const supabaseKey = 'sb_publishable_vtnoOpx6sTS5ICMj30uGnw_jXzbcZOa';
const supabase = createClient(supabaseUrl, supabaseKey);

//--------------------------------------------------------
// Handle form submission and insert data into Supabase
//--------------------------------------------------------
const form = document.forms['mobile-techno-form'];

function getRadioValue(name) {
    const radios = document.getElementsByName(name);
    for (const radio of radios) {
        if (radio.checked) {
            return radio.value;
        }
    }
    return null;
}

form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get the values from the form fields
    const fname = document.getElementById('fname').value.trim();
    const lname = document.getElementById('lname').value.trim();
    const addressl1 = document.getElementById('addressl1').value.trim();
    const addressl2 = document.getElementById('addressl2').value.trim();
    const towncity = document.getElementById('towncity').value.trim();
    const gender = getRadioValue('genderRadios');
    const phonetype = getRadioValue('phonetypeRadios');
    const providerInput = document.getElementById('provider');
    const provider = providerInput.options[providerInput.selectedIndex].value;
    const phonestudy = document.getElementById('phonestudy').value.trim();

    console.log('data: ', { fname, lname, addressl1, addressl2, towncity, gender, phonetype, provider, phonestudy });

    // Validate the form data (addressl2 is optional)
    if (!fname || !lname || !addressl1 || !towncity || !gender || !phonetype || !provider || !phonestudy) {
        alert('Please fill in all required fields.');
        return;
    }

    // Send straight to Supabase. This works only if the table columns and RLS policy match.
    await insertData({ fname, lname, addressl1, addressl2, towncity, gender, phonetype, provider, phonestudy });
});

//--------------------------------------------------------
// Insert the form data into the 'mobiletechnologyform' table
//--------------------------------------------------------
async function insertData(payload) {
    const row = {
        fname: payload.fname,
        lname: payload.lname,
        addressl1: payload.addressl1,
        addressl2: payload.addressl2,
        towncity: payload.towncity,
        gender: payload.gender,
        phonetype: payload.phonetype,
        provider: payload.provider,
        phonestudy: payload.phonestudy
    };

    const { data, error } = await supabase
        .from('mobiletechnologyform')
        .insert([row])
        .select();

    if (error) {
        console.error('Error inserting form data:', error);
        alert(`ERROR! INSERT FAILED!\n${error.message}`);
        return null;
    }

    alert(`Data (${payload.fname} ${payload.lname}) inserted successfully!`);
    form.reset();
    return data;
}

function DarkMode() {
    const slideshow = document.getElementById("SlideShow");
    const toggleButton = document.getElementById("dark-mode-toggle");
    const isDarkMode = slideshow?.classList.toggle("dark-mode") ?? false;

    toggleButton?.classList.toggle("active", isDarkMode);
    toggleButton?.setAttribute("aria-pressed", String(isDarkMode));
    if (toggleButton) {
        toggleButton.textContent = isDarkMode ? "Toggle Light Mode" : "Toggle Dark Mode";
    }
}

document.getElementById("dark-mode-toggle")?.addEventListener("click", DarkMode);