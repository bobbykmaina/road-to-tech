import { DeepLessonDocument } from '../../../types/curriculum';

export const ITSUP_U2_U3_EXTRA_LESSONS: Record<string, DeepLessonDocument> = {
  'itsup.2.2.1': {
    id: 'itsup.2.2.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 2: Hardware',
    topicTitle: '2.2 How a Computer Starts',
    code: '2.2.1',
    title: 'Power-On Sequence: POST Beep/LED Codes, Boot Order, Secure Boot, TPM 2.0 & Startup Recovery',
    readMinutes: 12,
    prerequisites: ['2.1.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Trace every stage from pressing the power button through UEFI/BIOS, POST, bootloader, OS kernel load, and sign-in screen.',
      'Map hardware and startup symptoms (no lights, fans spin/black screen, beep codes, "no bootable device", BSOD loop) to the exact failing stage.',
      'Explain what Boot Order, Secure Boot, and Trusted Platform Module (TPM 2.0) do during startup.',
      'Select appropriate recovery options (Safe Mode, Startup Repair, System Restore) before resorting to OS reinstallation.',
    ],

    whyThisMatters: {
      scenarioTitle: '9:00 AM Desk Walk-Up: "My Laptop Turns On—Just Nothing Shows Up!"',
      narrative:
        'A designer brings in a laptop whose keyboard backlight glows and fans hum, yet the screen stays black; a second laptop says `"No bootable device found"`; a third sits in an endless spinning loop after an update. Knowing the five distinct boot stages prevents guessing wildly and pinpoints power vs. RAM/GPU vs. storage/boot order vs. OS driver failure in two minutes.',
    },

    plainEnglish: {
      analogyTitle: 'Opening a Restaurant in Five Strict Steps Before Serving Food',
      analogy:
        'You cannot hand a menu to a customer before unlocking the front door, turning on the stove, checking the walk-in fridge works (**POST**), opening the recipe book (**bootloader**), and plating the kitchen (**operating system**). If the lights never turn on, you check the breaker—not the menu!',
      technicalDefinition:
        'Startup initializes firmware (UEFI/BIOS), verifies hardware integrity via Power-On Self-Test (POST) and security hardware (TPM/Secure Boot), locates a configured boot device, hands off to the OS bootloader, and starts the operating system kernel.',
      paragraphs: [
        'Every time power is pressed: (1) electricity stabilizes -> (2) **UEFI/BIOS firmware** executes **POST** (checking CPU, RAM, display) -> (3) firmware walks the **Boot Order** list -> (4) the **bootloader** launches the OS -> (5) sign-in appears.',
        '**Secure Boot** checks digital signatures on boot files so hidden startup malware (bootkits) cannot hijack Windows before antivirus even loads. **TPM 2.0 (Trusted Platform Module)** is a dedicated security chip holding cryptographic keys for Windows 11 and drive encryption.',
        'Watch where startup stalls! If someone left an unbootable USB thumb drive plugged in and USB sits above Internal NVMe in Boot Order, you see `"Non-system disk"` or boot hangs until unplugged.',
      ],
    },

    deepDive: {
      intro: 'Match every startup symptom to the exact failing boot stage.',
      steps: [
        {
          step: '01',
          title: 'Stage 1 — No Lights, No Fans (Power Failure)',
          explanation:
            'Check wall outlet, surge strip, power brick LED, charging port debris, and battery reset pinhole before suspecting motherboard or PSU.',
        },
        {
          step: '02',
          title: 'Stage 2 — Fans Spin, No Display / POST Beep or LED Codes',
          explanation:
            'Firmware failed **POST** before video initialized. Count blink codes on Dell/HP/Lenovo power LEDs or beep patterns—most point straight to unseated RAM or failed GPU/system board. Check external monitor too in case only laptop backlight died.',
        },
        {
          step: '03',
          title: 'Stage 3 — "No Bootable Device Found"',
          explanation:
            'POST passed, yet firmware found no valid OS loader. First unplug external USB sticks/docks (wrong boot order!). Then inspect UEFI setup to see whether the internal NVMe/SATA SSD is still detected.',
        },
        {
          step: '04',
          title: 'Stage 4 — Boot Loop or Stop Code After Vendor Logo',
          explanation:
            'Hardware and bootloader succeeded, and the **OS/driver** crashed mid-load. Enter the **Recovery Environment (WinRE)**: test **Safe Mode** (minimal drivers), **Startup Repair**, **Uninstall Latest Update**, or **System Restore** before reinstalling.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Boot Diagnostic Map: Symptom -> Failing Stage -> First Check',
        asciiFallback: `[Power Button] -> (Dead: no lights/fan?) ---> Outlet / Brick / PSU
       |
       v
[UEFI & POST]  -> (Fans spin + black / beeps?) ---> External display test / Reseat RAM
       |
       v
[Boot Order + TPM/Secure Boot] -> ("No boot device"?) ---> Unplug USBs / Check SSD in UEFI
       |
       v
[Bootloader -> OS Kernel] -> (Spinner/BSOD loop?) ---> WinRE: Safe Mode / Rollback / Startup Repair`,
      },
      workedExample: {
        title: 'Solving "Operating System Not Found" in 20 Seconds',
        context: 'User panicked after rebooting their desktop and seeing a black screen with white text: "No bootable device—strike F1 to retry."',
        steps: [
          'Ask: "Do you have any USB flash drives, SD cards, or external hard drives plugged in right now?"',
          'User spots a colleague’s USB backup stick left in the front port.',
          'User unplugs the USB drive and restarts -> Windows boots cleanly in 12 seconds.',
          'In UEFI setup later, ensure Internal NVMe sits at Boot Priority #1 ahead of USB storage (or disable USB boot per security policy).',
        ],
        outcome: 'Saved an unnecessary field dispatch and reimage in under a minute.',
      },
    },

    supportWalkthrough: {
      intro: 'Walk callers calmly from outside hardware checks into recovery only when needed.',
      steps: [
        {
          phase: 'Count Lights & Sounds',
          action: 'Ask user to read any blinking CapsLock/Power LED rhythm (e.g., 2 amber, 4 white) or exact screen line.',
          whyItWorks: 'Vendor LED blink charts decode RAM vs motherboard vs display faults immediately.',
        },
        {
          phase: 'Preserve Data First',
          action: 'Try Safe Mode, System Restore, and Startup Repair before clicking Reset or Reinstall.',
          whyItWorks: 'A bad driver or update takes 5 minutes to undo; reinstalling wipes apps and risks data.',
        },
      ],
      questionsToAsk: [
        '"Do you hear fans spinning or see any keyboard/power lights blinking in a pattern?"',
        '"Do you see the manufacturer logo first, or does the screen stay completely black from second one?"',
        '"Are any USB flash drives or external docks plugged in?"',
      ],
      sampleUserWording: [
        {
          situation: 'Checking LED blink codes over the phone',
          sayThis:
            '"Look closely at the tiny light next to the charging port or power button—does it blink a pattern like three amber flashes followed by two white ones?"',
        },
      ],
      ticketNoteTemplate: {
        category: 'Hardware -> Boot / POST Failure',
        priorityFormula: 'Impact: Low (1 user) × Urgency: High (Dead workstation) = P2 High',
        internalNotes: `[SYMPTOM] Laptop displays 2 amber / 4 white power LED blink code; fans spin, internal & external screens stay blank.
[STAGE ISOLATED] POST Memory Failure (failed prior to bootloader/OS).
[ACTION] Verified wall outlet & known-good 65W adapter. Dispatched L2 Deskside to reseat/test SODIMM module and inspect warranty status.`,
        customerReply:
          'Hi Jordan — Based on the blinking power light code, your laptop is flagging a memory hardware fault before Windows loads. Our deskside technician is bringing a diagnostic kit and spare module to Desk 3A at 10:30 AM.',
        escalationCriteria:
          'If beep/LED code persists after reseating RAM or internal SSD disappears from UEFI, escalate to L2 Hardware / Warranty RMA.',
      },
    },

    commonTraps: [
      {
        trap: 'Reinstalling Windows immediately when a laptop stalls in a post-update boot loop.',
        reality:
          'WinRE Startup Repair, uninstalling the last quality update, or rolling back one driver in Safe Mode fixes most OS boot loops in 10 minutes with zero data loss.',
      },
      {
        trap: 'Confusing Secure Boot with BitLocker disk encryption.',
        reality:
          'Secure Boot checks digital signatures on bootloaders before OS launch; BitLocker encrypts stored data on disk (often storing keys in the TPM 2.0 chip).',
      },
    ],

    keyTerms: [
      {
        term: 'POST (Power-On Self-Test)',
        shortDef: 'Early firmware hardware sanity check running right after power-on before any OS loads.',
        fullDef:
          'Signals fatal RAM, CPU, or GPU errors using beep codes or blinking power/CapsLock LED sequences.',
      },
      {
        term: 'UEFI & Boot Order',
        shortDef: 'Modern system firmware replacing legacy BIOS, deciding which storage/network device loads first.',
        fullDef:
          'Holds settings for Secure Boot, TPM, virtualization, and boot priority (NVMe, USB, PXE).',
      },
      {
        term: 'Secure Boot & TPM 2.0',
        shortDef: 'Bootloader signature verification (Secure Boot) + hardware cryptographic key chip (TPM 2.0).',
        fullDef:
          'Both are mandatory Windows 11 hardware security prerequisites protecting startup integrity and encryption.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-221-q1',
        prompt: 'A PC powers on, fans spin, and it emits 3 short beeps with nothing on either internal or external screens. Which stage failed?',
        options: [
          'POST hardware check (commonly RAM or video initialization) before bootloader or OS.',
          'Windows User Profile loading.',
          'Outlook add-in startup.',
          'DNS name resolution.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Beep codes occur during firmware POST before any operating system or software even begins loading.',
          'Incorrect: Profiles load at the very end after OS kernel startup.',
          'Incorrect: Applications load long after sign-in.',
          'Incorrect: Networking services start inside the running OS.',
        ],
        takeaway: 'Beep/blink codes with no display point squarely to POST hardware failure.',
      },
      {
        id: 'itsup-221-q2',
        prompt: 'What is the very first 10-second check when a desktop prints "No bootable device found" right after someone plugged in external media?',
        options: [
          'Unplug external USB drives/SD cards and reboot in case Boot Order tried booting the non-system USB.',
          'Format the internal SSD immediately.',
          'Replace the monitor HDMI cable.',
          'Reset the user’s email password.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Many systems list USB before internal NVMe in Boot Order; removing forgotten thumb drives solves it instantly.',
          'Incorrect: Formatting destroys intact user data unnecessarily.',
          'Incorrect: Text already appears on screen—display works fine.',
          'Incorrect: Unrelated to cloud passwords.',
        ],
        takeaway: 'Check Boot Order and unplug non-bootable USB sticks before suspecting a dead SSD.',
      },
      {
        id: 'itsup-221-q3',
        prompt: 'Which role does the Trusted Platform Module (TPM 2.0) chip serve on modern business laptops?',
        options: [
          'Securely stores hardware encryption keys and integrity measurements (used by Windows 11 and BitLocker).',
          'Boosts Wi-Fi download speed to 6 GHz.',
          'Stores a full copy of user Word documents in the cloud.',
          'Acts as the laptop cooling heatsink fan.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: TPM 2.0 is a hardware root-of-trust chip safeguarding encryption and authentication keys.',
          'Incorrect: Wi-Fi speed relies on the wireless NIC.',
          'Incorrect: Cloud sync is OneDrive/SharePoint.',
          'Incorrect: Thermal management belongs to heatsinks and fans.',
        ],
        takeaway: 'TPM 2.0 protects cryptographic keys; Secure Boot verifies trusted boot software.',
      },
      {
        id: 'itsup-221-q4',
        prompt: 'After a Windows Update, a PC reaches the spinning logo and crashes with a blue screen every restart. Which recovery step preserves files best?',
        options: [
          'Boot into Safe Mode or Windows Recovery Environment (WinRE) to roll back the recent driver/update or run System Restore.',
          'Immediately perform a full factory wipe without backing up.',
          'Replace the laptop power brick.',
          'Open the PSU casing to inspect capacitors.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Safe Mode loads minimal generic drivers so you can remove the faulty update/driver safely.',
          'Incorrect: Wiping destroys user data unnecessarily before basic recovery.',
          'Incorrect: Power gets cleanly past firmware into OS load—brick is working.',
          'Incorrect: Opening PSUs is hazardous and unrelated to OS driver crashes.',
        ],
        takeaway: 'When crashes hit after the vendor logo, test Safe Mode and update rollback before wiping.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Match 10 Startup Symptoms to Boot Stages',
      instructions: [
        'Write down the exact failing stage (Power, POST, Boot Order/Storage, Secure Boot/TPM, OS/Drivers) for 10 scenarios: dead outlet, 2 beeps black screen, USB left in, missing NVMe in UEFI, spinning wheel forever, bad GPU driver after update, dead CMOS battery resetting clock, TPM disabled stopping BitLocker, wrong OS resolution after Safe Mode, and cracked laptop panel with working external monitor.',
      ],
      verificationCheck: 'Every symptom maps directly to the first logical test rather than guessing.',
    },

    summaryBullets: [
      'Startup runs sequentially: Power -> UEFI/POST -> Secure Boot/Boot Order -> Bootloader -> OS Kernel -> Sign-in.',
      'No lights/fans points to power; fans + black screen + beeps points to POST/RAM/GPU.',
      '"No boot device" often starts with a forgotten USB stick in Boot Order before hardware SSD failure.',
      'Secure Boot blocks tampered bootloaders; TPM 2.0 safeguards hardware encryption keys for Windows 11.',
      'Use WinRE Safe Mode, Startup Repair, and Update Rollback before ever wiping user data.',
    ],

    sourcesToVerify: [
      'CompTIA A+ Core 1 (220-1101) — Hardware & Troubleshooting Boot Sequences',
      'Microsoft Learn — Windows Recovery Environment (WinRE) & TPM 2.0 Overview',
    ],
  },

  'itsup.2.3.1': {
    id: 'itsup.2.3.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 2: Hardware',
    topicTitle: '2.3 Peripherals and Ports',
    code: '2.3.1',
    title: 'Ports & USB Speeds (USB 2/3/4, Thunderbolt), Dual Monitors (Win+P), Docks, Headsets & OS Camera/Mic Privacy',
    readMinutes: 11,
    prerequisites: ['2.1.1', '2.2.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Identify USB-A, USB-C, Thunderbolt, HDMI, DisplayPort, VGA, DVI, Ethernet (RJ-45), and audio ports accurately.',
      'Explain why USB 2.0 (~480 Mbps), USB 3.x (5–20 Gbps), and USB4 (up to 40 Gbps) cause dramatic external drive or dock speed mismatches.',
      'Troubleshoot missing second monitors across cable, port, monitor input source, Win+P Extend/Duplicate, resolution, refresh rate, and scaling.',
      'Fix non-working webcams, microphones, and Bluetooth headsets across OS privacy toggles and meeting-app audio selection.',
    ],

    whyThisMatters: {
      scenarioTitle: '"My Meeting Starts Now—Nobody Hears Me and Monitor #2 Is Dead!"',
      narrative:
        'A remote manager plugs a borrowed USB-C cable into a dock and wonders why neither dual 4K display nor Ethernet wakes up, while their laptop webcam shows a black box in meetings. Ninety percent of peripheral tickets are not broken hardware: they are USB-C power-only phone cables lacking DisplayPort Alt-Mode, monitors stuck on HDMI-1 when plugged into DisplayPort, `Win+P` stuck on "PC screen only," or OS Camera/Microphone privacy switches turned Off.',
    },

    plainEnglish: {
      analogyTitle: 'Same Shaped Plug, Totally Different Pipes Inside',
      analogy:
        'Two garden hoses can share the exact same brass nozzle (**USB-C shape**) yet carry completely different pipes inside: a cheap phone-charging USB-C cable only carries trickle power and slow USB 2.0 data, while a thick USB-C/Thunderbolt cable carries 100W power, 40 Gbps data, AND dual monitors simultaneously!',
      technicalDefinition:
        'Peripheral troubleshooting separates physical connector/cable capability (USB standard generation, DisplayPort Alt-Mode, video input source) from OS display configuration (`Win+P`, scaling/refresh) and privacy/default-device audio permissions.',
      paragraphs: [
        'Know your rough speeds: **USB 2.0** tops out around **480 Mbps** (why backups crawl when plugged into a black USB 2.0 port or phone cable); **USB 3.x** jumps to **5–20 Gbps**; **USB4 / Thunderbolt** carries up to **40 Gbps** plus multi-display video and laptop charging.',
        'Monitor tickets follow a reliable 4-step path: **Cable -> Port -> Monitor’s own Input Source button -> Windows Display settings (`Win + P` Extend vs Duplicate, resolution, scaling, refresh rate)**.',
        'When a webcam or headset stops working overnight right after a privacy prompt was dismissed, open **OS Privacy & Security settings** for Camera and Microphone first, then verify the exact **Input/Output device dropdown** inside the meeting app.',
      ],
    },

    deepDive: {
      intro: 'Diagnose ports, displays, docks, and audio/video peripherals in logical order.',
      steps: [
        {
          step: '01',
          title: 'Connector & Port Quick Identification',
          explanation:
            'USB-A (rectangular host port), USB-C (reversible oval—check lightning bolt for Thunderbolt or "SS/10/DP" icons), HDMI & DisplayPort (modern digital audio+video), VGA (blue 15-pin analog) & DVI (legacy white pins), RJ-45 (wired Ethernet jack), 3.5mm TRS/TRRS audio jack.',
        },
        {
          step: '02',
          title: 'Second Monitor Not Detected Check',
          explanation:
            'Check power LED on the monitor; confirm monitor physical **Input button** matches the plugged port (DisplayPort vs HDMI-1); test a known-good cable directly into laptop bypassing the dock; press **Win + P** -> select **Extend**; inspect Display Settings -> **Detect** and check refresh rate/scaling.',
        },
        {
          step: '03',
          title: 'Docking Station Isolation',
          explanation:
            'Docks bundle charging, video, Ethernet, and USB over one cable. Test the laptop with a **known-good dock** (or bypass the dock directly): if video returns directly on laptop HDMI, the fault sits in the dock cable, dock firmware, or Thunderbolt/DisplayLink driver.',
        },
        {
          step: '04',
          title: 'Headsets, Mice & Webcams',
          explanation:
            'Wireless dongles/Bluetooth: swap USB port, replace AAA battery, re-pair Bluetooth. Webcams/Mics: slide open physical laptop **privacy shutter** first, check **OS Camera/Mic Privacy access**, then select the headset (not Monitor Speakers!) inside OS Sound & meeting settings.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Peripheral Isolation Funnel (Display, USB, Dock & Audio)',
        asciiFallback: `[User Symptom: Dead Screen / Slow Drive / No Mic]
       |---> Display? -> Power -> Input Button -> Win+P (Extend) -> Bypass Dock directly
       |---> Slow USB? -> Swap phone-charge USB-C/USB 2.0 port to USB 3.x / USB4 port
       |---> Webcam/Mic? -> Physical Shutter -> OS Privacy Switch -> Meeting App Default Device`,
      },
      workedExample: {
        title: 'Solving Three Peripheral Tickets on One Desk Call',
        context: 'Remote starter moved desks: second monitor black, external backup disk crawling at 35 MB/s, webcam black in video call.',
        steps: [
          'Second monitor: Pressed monitor physical menu button -> changed Input from HDMI-1 to DisplayPort -> pressed Win+P -> Extend -> screen snapped on immediately.',
          'Slow external SSD: Saw drive was plugged into a thin USB-C phone charging cord (USB 2.0 480 Mbps). Swapped to short blue-tipped USB-C 3.2 Gen2 cable -> speed jumped 10x.',
          'Black webcam: Had user slide open tiny physical camera shutter above screen AND toggle Settings -> Privacy & security -> Camera -> "Let desktop apps access camera = On."',
        ],
        outcome: 'Fixed all three hardware tickets remotely in 6 minutes with zero replacement hardware ordered.',
      },
    },

    supportWalkthrough: {
      intro: 'Teach users fast self-checks (`Win+P`, shutters, monitor input buttons) without condescending jargon.',
      steps: [
        {
          phase: 'Check Physical Shutters First',
          action: 'Ask whether there is a tiny slider above the lens or hardware mute light glowing red on the headset cord.',
          whyItWorks: 'Solves 30% of "broken camera/mic" tickets in ten seconds before touching drivers.',
        },
        {
          phase: 'Bypass Adapters When Isolating',
          action: 'Remove cheap dongles and docks for one test directly into laptop ports.',
          whyItWorks: 'Instantly proves whether the laptop, dock, adapter, or monitor failed.',
        },
      ],
      questionsToAsk: [
        '"If you press Windows key + P once, is it set to Extend or PC screen only?"',
        '"Looking at the buttons on the edge of the monitor itself, does it say No Signal on HDMI 1 while plugged into DisplayPort?"',
        '"Is there a small physical sliding cover over your webcam lens?"',
      ],
      sampleUserWording: [
        {
          situation: 'Checking audio defaults cleanly',
          sayThis:
            '"Sometimes Windows shifts your sound output to your desk monitor’s hidden speakers! Let’s click the speaker icon near the clock and switch output right back to your headset."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Hardware -> Monitor & Meeting Peripherals',
        priorityFormula: 'Impact: Low (1 user) × Urgency: High (Meeting in 10m) = P2 High',
        internalNotes: `[SYMPTOMS] Secondary monitor "No Signal" + webcam black + slow external drive.
[CHECKS] Switched monitor OSD input to DisplayPort and set Win+P to Extend. Enabled OS Camera Privacy toggle and slid lens shutter open. Moved external SSD from USB 2.0 cord to USB 3.2 port.
[RESULT] All peripherals verified working in live test call.`,
        customerReply:
          'Hi Alex — Everything is now verified! Monitor #2 is back on DisplayPort in Extend mode, your camera privacy switch is on, and your backup drive is using the high-speed USB port. Have a great meeting!',
        escalationCriteria:
          'Escalate/swap hardware only after testing direct laptop video bypass and known-good USB-C/Thunderbolt cable.',
      },
    },

    commonTraps: [
      {
        trap: 'Assuming every USB-C cable carries dual monitors and fast 40 Gbps data.',
        reality:
          'Charging-only USB-C cords only carry power + USB 2.0 speeds. Always verify Thunderbolt / USB 3.x / DisplayPort-capable cables for docks and displays.',
      },
      {
        trap: 'Reinstalling Windows audio drivers before checking OS Privacy & Default Device.',
        reality:
          'Meeting apps regularly pick monitor HDMI audio or get blocked by OS Camera/Microphone privacy toggles after feature updates.',
      },
    ],

    keyTerms: [
      {
        term: 'USB 2.0 / 3.x / USB4 & Thunderbolt',
        shortDef: 'USB speed tiers: ~480 Mbps (2.0), 5–20 Gbps (3.x), up to 40 Gbps + video/power (USB4/Thunderbolt).',
        fullDef:
          'Cables and ports share identical USB-C physical plugs while supporting drastically different power, data, and video capabilities.',
      },
      {
        term: 'Win + P (Display Modes)',
        shortDef: 'Windows projection switcher toggling PC screen only, Duplicate, Extend, and Second screen only.',
        fullDef:
          'Checking Win+P alongside resolution, refresh rate, and DPI scaling fixes most multi-monitor desk tickets.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-231-q1',
        prompt: 'A user’s brand-new external NVMe SSD transfers files at only ~35 MB/s using a spare phone cable. What is the likeliest reason?',
        options: [
          'The spare phone USB-C cord only supports USB 2.0 speeds (~480 Mbps) instead of USB 3.x (5–20 Gbps) or USB4.',
          'The SSD is spinning too slowly at 5400 RPM.',
          'DisplayPort cables do not carry Ethernet.',
          'Windows 11 caps all external drives at 35 MB/s.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: 480 Mbps USB 2.0 tops out right around 35–42 MB/s real throughput—swapping to a rated USB 3.x/USB4 cable fixes it instantly.',
          'Incorrect: NVMe SSDs have no spinning platters.',
          'Incorrect: Unrelated to DisplayPort.',
          'Incorrect: Windows supports full 10–40 Gbps transfers on proper ports/cables.',
        ],
        takeaway: 'Check USB cable and port generations (~480 Mbps USB 2.0 vs 5–40 Gbps) whenever transfers crawl.',
      },
      {
        id: 'itsup-231-q2',
        prompt: 'A user reports their microphone works in Settings test yet nobody hears them inside their video meeting app. What should you check first?',
        options: [
          'Check OS Microphone Privacy permissions for desktop/meeting apps AND verify the selected Microphone dropdown inside the meeting app itself.',
          'Replace the laptop motherboard.',
          'Change monitor scaling from 125% to 100%.',
          'Flush the DNS cache.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Both OS privacy toggles and in-app device dropdown mismatches regularly mute working mics.',
          'Incorrect: Far too extreme before checking software permissions.',
          'Incorrect: Display scaling does not control audio.',
          'Incorrect: DNS handles domain name resolution, not mic routing.',
        ],
        takeaway: 'Check hardware mute/shutter -> OS Privacy toggle -> Meeting app audio dropdown.',
      },
      {
        id: 'itsup-231-q3',
        prompt: 'Which two ports carry combined modern digital video AND audio cleanly without bulky screw adapters?',
        options: [
          'HDMI and DisplayPort (plus USB-C with DP Alt-Mode).',
          'VGA and RJ-45.',
          'VGA and PS/2.',
          'RJ-45 and 3.5mm mono jack.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: HDMI, DisplayPort, and full-featured USB-C carry high-resolution digital video and digital audio.',
          'Incorrect: VGA is analog video only; RJ-45 is Ethernet.',
          'Incorrect: Both are legacy non-audio interfaces.',
          'Incorrect: RJ-45 carries network frames, not display signals.',
        ],
        takeaway: 'HDMI, DisplayPort, and full-featured USB-C carry digital display; VGA/DVI are legacy.',
      },
      {
        id: 'itsup-231-q4',
        prompt: 'When isolating a failing USB-C docking station with black monitors, what quick test separates dock vs. laptop/monitor?',
        options: [
          'Plug one monitor directly into the laptop’s video port (bypassing the dock) or swap in a known-good dock.',
          'Uninstall Microsoft Excel.',
          'Disable BitLocker permanently.',
          'Ask the user to clear browser cookies.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Direct bypass proves immediately whether the laptop GPU and monitor work when the dock is removed.',
          'Incorrect: Unrelated to video signal hardware.',
          'Incorrect: Security risk with zero effect on displays.',
          'Incorrect: Browser data has no connection to DisplayPort output.',
        ],
        takeaway: 'Bypass the dock directly or swap a known-good dock to pinpoint video faults in seconds.',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Fix Display & Audio/Video Peripheral Tickets',
      targetTab: 'simulator',
      instructions: [
        'Run both Beginner peripheral scenarios in the Service Desk Simulator (dual black dock monitors AND webcam/headset meeting permissions).',
        'On your own computer, press Win+P (or check Display Preferences) and verify which OS privacy toggles govern camera/mic access.',
      ],
      verificationCheck: '4/4 score on both hardware/peripheral simulator tickets.',
    },

    summaryBullets: [
      'USB-C connectors share one physical shape across slow USB 2.0 cords (480 Mbps) and 40 Gbps Thunderbolt/video cables.',
      'Fix missing monitors sequentially: Power -> Cable/Port -> Monitor physical Input Source -> Win+P Extend -> Scaling/Drivers.',
      'Swap in a known-good dock or plug directly into the laptop to isolate docking station faults fast.',
      'Troubleshoot cameras and mics via: Physical Shutter/Mute -> OS Privacy Settings -> App Default Audio/Video Selection.',
      'Replace batteries, swap USB ports, or re-pair Bluetooth before replacing wireless keyboards/mice.',
    ],

    sourcesToVerify: [
      'CompTIA A+ Core 1 (220-1101) — Connectors, Cables & Peripheral Troubleshooting',
      'USB Implementers Forum (USB-IF) — USB 2.0, USB 3.2 & USB4 Speed & Alt-Mode Overview',
    ],
  },

  'itsup.2.4.1': {
    id: 'itsup.2.4.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 2: Hardware',
    topicTitle: '2.4–2.5 Printers, Scanners, Laptops & Mobile Devices',
    code: '2.4.1',
    title: 'Printers (Laser/Inkjet/Thermal/Follow-Me), Print Spooler, Laptop Power Plans, Mobile MDM & BYOD Risk',
    readMinutes: 13,
    prerequisites: ['2.1.1', '2.3.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Trace the print pipeline cleanly (App -> Driver -> Spooler Queue -> Printer) to separate local PC, queue, network, and hardware faults.',
      'Troubleshoot paper jams, "Printer Offline," stuck spooler jobs, streaks/toner defects, scan-to-email errors, and changed printer IPs (Standard TCP/IP vs WSD).',
      'Diagnose laptop battery/charging/wake issues using `powercfg /batteryreport` and spot swollen-battery safety hazards.',
      'Contrast company-owned MDM-managed devices vs. BYOD risks and explain immediate lost/stolen device response steps.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Two Urgent Floor Tickets: Finance Checks Won’t Print & a Lost Sales Phone',
      narrative:
        'A warehouse thermal label printer prints blank labels while an office multifunction laser printer displays `"Offline"` after a weekend router restart assigned it a new IP address. At the exact same moment, a traveling rep reports leaving an unlocked personal BYOD phone with work email at an airport coffee shop. Separating print queues from network IPs and securing mobile devices immediately makes you the calmest analyst on shift.',
    },

    plainEnglish: {
      analogyTitle: 'A Restaurant Kitchen Order Rail (The Print Spooler)',
      analogy:
        'When five waiters send orders, the **driver** translates them into kitchen language and clips them onto a waiting rail called the **print spooler**. If ticket #1 rips halfway off the spike and jams the rail, tickets #2 through #10 back up behind it forever—clearing that single stuck job and resetting the rail clears everyone’s food immediately!',
      technicalDefinition:
        'Office printing routes application output through device-specific drivers and OS spooler queues across USB, print servers, IP ports, or badge-released "follow-me" cloud print services; mobile endpoint care pairs OS/power diagnostics with Mobile Device Management (MDM) lock/wipe controls.',
      paragraphs: [
        'Know your printer families: **Laser printers** fuse dry **toner** powder rapidly (business standard—streaks usually mean dirty drum/low toner); **Inkjet printers** spray liquid ink (color photos/light home use); **Thermal printers** heat special paper (shipping labels & receipts—printing blank usually means label roll loaded upside down!).',
        'Why do network printers magically go `"Offline"`? Either the printer restarted and picked up a new dynamic **IP address** when configured with auto-discovery (WSD) instead of a reserved **Standard TCP/IP port**, or one bad corrupt job froze the **Print Spooler service**.',
        'For laptops and phones: **BYOD (Bring Your Own Device)** saves hardware cost yet makes separating personal photos from corporate email harder—which is why **Mobile Device Management (MDM)** policies lock/retire work containers safely without wiping personal family photos when configured properly.',
      ],
    },

    deepDive: {
      intro: 'Separate printer faults cleanly across four checkpoints and safeguard mobile/laptop fleets.',
      steps: [
        {
          step: '01',
          title: 'Four-Part Printer Separation (Interview Gold)',
          explanation:
            'Test: (1) **Printer itself** (power, screen messages, jam doors, toner, test page from printer menu), (2) **Network/Link** (cable, Wi-Fi, ping its IP), (3) **Print Queue / Spooler** (stuck "Deleting" job -> stop Spooler service, clear `C:\\Windows\\System32\\spool\\PRINTERS`, start Spooler), and (4) **PC/Driver** (wrong default printer, reinstall driver, add by Standard TCP/IP).',
        },
        {
          step: '02',
          title: 'Cloud / Follow-Me Printing & Scan-to-Email',
          explanation:
            'Follow-me printing holds your job in one secure queue until you tap your ID badge at *any* office multifunction printer. Scan-to-email failures typically indicate a changed SMTP relay credential, oversized attachment limit, or blocked network port.',
        },
        {
          step: '03',
          title: 'Laptop Sleep/Wake, Power Plans & `powercfg /batteryreport`',
          explanation:
            'Check charger wattage (a 20W phone brick won’t keep a 65W laptop running under load), lint inside USB-C charging ports, sleep/hibernate wake bugs, and run `powercfg /batteryreport` in Windows Command Prompt to compare Design Capacity vs. Full Charge Capacity. **Safety:** If a battery is visibly swollen/bulging, power off immediately and follow safe hazmat disposal!',
        },
        {
          step: '04',
          title: 'Mobile Tasks, BYOD Risks & Lost/Stolen Action',
          explanation:
            'Support iOS/Android Wi-Fi, cellular data, mail sync, storage full, and app permissions. On lost/stolen phones or laptops: (1) report to Security/IT immediately, (2) issue **MDM remote lock or wipe**, (3) **reset passwords and revoke active tokens** for every signed-in company account.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Print Pipeline & 4-Layer Printer Fault Isolation',
        asciiFallback: `[1. App ("Ctrl+P")] -> [2. Printer Driver] -> [3. OS Print Spooler Queue] -> [4. Printer IP / USB]
   | wrong default?       | garbage text?         | stuck "Deleting"?            | jam / offline / new IP?`,
      },
      workedExample: {
        title: 'Fixing an "Offline" Multifunction Printer + Checking a Draining Laptop Battery',
        context: 'Floor 3 laser printer displays "Offline" after weekend power flicker; salesperson reports laptop dying in 40 minutes.',
        steps: [
          'Printer: Walk user to printer touchscreen -> print Configuration Page -> shows new IP `192.168.10.88` while Windows looked at old `.42`. Re-add via **Standard TCP/IP** (and ask Network team for a fixed DHCP reservation) -> test page prints.',
          'Laptop battery: Run `powercfg /batteryreport` -> reveals Full Charge Capacity dropped to 11,400 mWh out of 54,000 mWh design capacity after 900 cycles -> approve genuine replacement battery under warranty.',
        ],
        outcome: 'Floor 3 resumes printing in 4 minutes; faulty laptop battery replaced safely before swelling.',
      },
    },

    supportWalkthrough: {
      intro: 'Always ask whether ONE user or ALL users see the printer offline first.',
      steps: [
        {
          phase: 'One PC vs Whole Floor',
          action: 'Ask "Can your neighbor print to that printer right now?"',
          whyItWorks: 'If neighbors print cleanly, the printer & network are healthy—focus 100% on this PC’s queue/driver/wrong default.',
        },
        {
          phase: 'Lost Device Urgency',
          action: 'Treat lost company or BYOD work-email devices as immediate security incidents.',
          whyItWorks: 'Minutes count before someone finds an unlocked screen or cached mailbox.',
        },
      ],
      questionsToAsk: [
        '"Does the printer’s own small display show Ready, or an error like Paper Jam / Load Tray 2?"',
        '"Is anyone else nearby able to print to that same machine right now?"',
        '"If it’s a thermal label printer, are the labels loaded shiny-side up?"',
        '"When was your phone or laptop last seen, and did it have a screen PIN enabled?"',
      ],
      sampleUserWording: [
        {
          situation: 'Checking why a thermal shipping label prints blank',
          sayThis:
            '"Thermal labels only darken on the heat-sensitive coated side—try opening the top lid and flipping the paper roll over so the coated side faces the print head, then print one test label."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Printing -> Network Printer Offline (IP Drift)',
        priorityFormula: 'Impact: Medium (Floor 3 team) × Urgency: Medium = P3 Medium',
        internalNotes: `[SYMPTOM] Floor 3 MFP showing Offline on multiple Windows PCs after building power test.
[DIAGNOSIS] Printer menu confirmed DHCP reassigned IP to 10.20.4.88; PCs used WSD auto-port pointing to stale .42.
[RESOLUTION] Cleared stuck spooler jobs, configured Standard TCP/IP port to 10.20.4.88, confirmed test page printed. Requested static DHCP reservation from NetOps.`,
        customerReply:
          'Hi Jordan — Printing is restored on Floor 3! After the weekend power test, the printer picked up a new network address. We updated the connection and verified a clean test page. Let us know if any job sits stuck.',
        escalationCriteria:
          'Escalate persistent paper-feed hardware failures to L4 Print Vendor / Maintenance Contract; escalate lost/stolen devices to InfoSec immediately.',
      },
    },

    commonTraps: [
      {
        trap: 'Telling a caller to reinstall Windows when one print job is jammed in "Deleting..."',
        reality:
          'Restarting the **Print Spooler** service after clearing `spool\\PRINTERS` clears 90% of jammed queues in under 60 seconds.',
      },
      {
        trap: 'Assuming BYOD personal phones carry zero risk because they didn’t cost company budget.',
        reality:
          'Without MDM/app protection, company attachments stay mixed with personal cloud backups and cannot be selectively wiped if an employee leaves or loses the phone.',
      },
    ],

    keyTerms: [
      {
        term: 'Print Spooler',
        shortDef: 'Background OS service queuing translated print jobs until the printer accepts them.',
        fullDef:
          'A single corrupt print file can freeze the entire queue until the Spooler service is stopped, cleared, and restarted.',
      },
      {
        term: 'Follow-Me Printing',
        shortDef: 'Queue holding jobs centrally until the user authenticates with badge/PIN at any office printer.',
        fullDef:
          'Protects confidential documents from sitting uncollected on open printer output trays.',
      },
      {
        term: 'BYOD (Bring Your Own Device) & MDM',
        shortDef: 'Personal phones/laptops used for work (BYOD) governed by Mobile Device Management (MDM) policies.',
        fullDef:
          'MDM enforces PINs, encryption, work app separation, and remote lock/retire/wipe when devices go missing.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-241-q1',
        prompt: 'A user cannot print, and another person at the next desk prints fine to that exact network printer. Which two layers are already proven healthy?',
        options: [
          'The printer hardware itself and the printer’s network connection—focus on the user’s PC, queue, wrong default printer, or driver.',
          'The user’s print spooler and PC USB cable.',
          'The user’s mouse and keyboard.',
          'Only the thermal fuser roller.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Comparing working vs broken users isolates the fault strictly to the user’s local machine/queue/driver.',
          'Incorrect: Those live on the broken PC, not proven healthy yet.',
          'Incorrect: Unrelated peripherals.',
          'Incorrect: If the printer works for the coworker, its internal rollers/fuser are fine.',
        ],
        takeaway: 'Compare neighboring users to separate local PC/queue issues from printer/network outages.',
      },
      {
        id: 'itsup-241-q2',
        prompt: 'Which Windows command generates an HTML health report comparing a laptop battery’s original Design Capacity against current Full Charge Capacity?',
        options: [
          'powercfg /batteryreport',
          'ipconfig /flushdns',
          'sfc /batterycheck',
          'diskmgmt /power',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `powercfg /batteryreport` writes `battery-report.html` showing cycle count and capacity wear.',
          'Incorrect: Clears local DNS cache.',
          'Incorrect: Invalid syntax.',
          'Incorrect: Not a valid Windows command.',
        ],
        takeaway: 'Run `powercfg /batteryreport` to back battery replacement requests with real capacity numbers.',
      },
      {
        id: 'itsup-241-q3',
        prompt: 'What is the primary security risk of letting staff read work email on unmanaged personal phones (BYOD) without MDM?',
        options: [
          'Company files mix with personal data and backups, and IT cannot enforce PIN encryption or selectively wipe work data if lost or when staff leave.',
          'Personal phones run faster CPUs that damage mail servers.',
          'BYOD automatically gives callers Global Administrator rights.',
          'Phones cannot connect to 5 GHz Wi-Fi.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Unmanaged BYOD leaks sensitive company data outside IT governance and remote wipe boundaries.',
          'Incorrect: CPU speeds cannot harm mail servers.',
          'Incorrect: Device choice does not elevate directory RBAC roles.',
          'Incorrect: Modern phones support 2.4/5/6 GHz Wi-Fi normally.',
        ],
        takeaway: 'Always verify MDM enrollment or app-protection rules on BYOD mobile access.',
      },
      {
        id: 'itsup-241-q4',
        prompt: 'An employee calls saying their work-enrolled smartphone was stolen 10 minutes ago. What must happen in immediate sequence?',
        options: [
          'Report immediately as a security event, trigger remote lock/wipe via MDM, and reset passwords + revoke active sign-in sessions for every work account.',
          'Wait 3 days to see if someone drops it at Lost & Found.',
          'Delete only the employee’s Windows Desktop shortcuts.',
          'Ask the employee to buy a new SIM card before notifying IT.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Speed stops thieves from reading cached email, MFA prompts, or saved browser tokens.',
          'Incorrect: Every hour waiting risks data theft.',
          'Incorrect: Desktop icons have zero effect on a stolen mobile device.',
          'Incorrect: Session revocation and remote lock must run first.',
        ],
        takeaway: 'Lost/stolen device = Report now -> Remote lock/wipe -> Reset passwords & revoke tokens.',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Clear Stuck Print Queues & Generate Battery Report',
      targetTab: 'simulator',
      instructions: [
        'Run both Printing scenarios inside the Service Desk Simulator (INC-1055 stuck print spooler AND the IP/offline network printer scenario).',
        'On a practice Windows laptop, run `powercfg /batteryreport` and read Design vs Full Charge capacity.',
      ],
      verificationCheck: '4/4 score on Printing simulator tickets + inspected battery health numbers.',
    },

    summaryBullets: [
      'Separate every print issue across 4 layers: User PC/Driver -> Print Spooler Queue -> Network/IP -> Printer Hardware.',
      'Prefer reserved IPs and Standard TCP/IP ports over flaky auto-discovery (WSD) to stop "Offline" printer tickets.',
      'Use `powercfg /batteryreport` for laptop endurance evidence; power down swollen batteries safely at once.',
      'Control BYOD risks through MDM policies enforcing PINs, encryption, work-app isolation, and remote retire/wipe.',
      'Lost/stolen mobile devices always require immediate reporting, remote lock/wipe, password change, and token revocation.',
    ],

    sourcesToVerify: [
      'CompTIA A+ Core 1 (220-1101) — Printers, Laptops & Mobile Device Support',
      'Microsoft Learn — Print Spooler Troubleshooting & powercfg Options',
    ],
  },

  'itsup.2.6.1': {
    id: 'itsup.2.6.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 2: Hardware',
    topicTitle: '2.6 Safe Hardware Diagnostics',
    code: '2.6.1',
    title: 'Hardware Isolation Method, ESD Safety, Power-Supply Warnings, Serial/Warranty RMA, Backup First & E-Waste',
    readMinutes: 10,
    prerequisites: ['2.1.1', '2.2.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Follow a disciplined one-change-at-a-time hardware diagnostic workflow (reseat, minimal boot, known-good swap, S.M.A.R.T./memory tests).',
      'Apply non-negotiable physical safety rules: ESD wrist straps, unplugging mains, never opening a PSU, edge-handling, and proper lifting.',
      'Verify device warranty via serial/service tag before opening sealed chassis and execute vendor RMA replacements cleanly.',
      'Protect user data before every hardware repair, weigh repair vs. replace economics, and route old electronics/batteries to approved e-waste.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Two Costly Beginner Mistakes in One Afternoon',
      narrative:
        'A keen trainee swaps three components simultaneously inside an unplugged desktop without touching bare metal or checking warranty first—voiding a valid next-day vendor warranty AND wiping a failing HDD before backing up the sales manager’s local desktop tax spreadsheets. Safe diagnostics keep hardware intact, technicians unharmed, warranties honored, and user files safe.',
    },

    plainEnglish: {
      analogyTitle: 'Testing One Fuse at a Time While Wearing Rubber Gloves',
      analogy:
        'An electrician never changes three breakers simultaneously, never touches bare capacitor guts, and never leaves power plugged in before swapping an outlet. You swap **one** known-good part, note the result, check whether the maker will replace it free (**warranty RMA**), and copy valuables out of the house before demolition.',
      technicalDefinition:
        'Safe hardware troubleshooting combines minimal-configuration isolation and non-destructive diagnostic suites (S.M.A.R.T., vendor memtest) with ESD mitigation, high-voltage PSU hazards, warranty preservation, pre-repair backups, and compliant e-waste disposal.',
      paragraphs: [
        'Rule #1: **Change one thing at a time and write down what happened.** If you swap RAM AND the NVMe AND reset UEFI simultaneously, you have zero idea which step fixed (or broke!) the machine.',
        '**Safety comes before speed:** wear an **ESD (electrostatic discharge)** wrist strap or touch unpainted metal chassis before handling chips, unplug mains AC power (and press Power 5 seconds to drain capacitors), hold boards strictly by their edges, and **NEVER open a power supply unit (PSU)**—capacitors inside hold lethal charge even unplugged.',
        'Before tearing open a fleet laptop, record its **Serial Number / Service Tag** and check **warranty status**. If covered, use the vendor’s **RMA (Return Merchandise Authorization)** repair path! Above all, **back up user data BEFORE repairing** and never wipe any drive without formal authorization.',
      ],
    },

    deepDive: {
      intro: 'Walk through the five classic hardware diagnostics alongside safety, RMA, and repair-vs-replace checks.',
      steps: [
        {
          step: '01',
          title: 'Five Classic Bench Diagnostic Cases',
          explanation:
            'Black screen (check external display + reseat RAM), No power (outlet/PSU paperclip/known-good brick), Slow disk/clicks (check **S.M.A.R.T.** health immediately & clone/backup right away!), Repeated beeping (decode POST beep/LED chart -> single RAM stick test), Overheating (blown dust out of vents, clogged fan, dried thermal paste).',
        },
        {
          step: '02',
          title: 'Minimal Hardware & Known-Good Swaps',
          explanation:
            'When a desktop refuses to POST, strip down to bare essentials (CPU + 1 stick RAM + power) disconnecting secondary drives and add-in cards. Boot from a clean diagnostic USB stick to separate OS corruption from true hardware failure ("hardware vs software test").',
        },
        {
          step: '03',
          title: 'ESD, Voltage & Ergonomic Safety',
          explanation:
            'Anti-static wrist strap on unpainted chassis; remove wrist jewelry; never open sealed PSUs or CRT/laser fusers while energized; bend knees when lifting heavy towers/UPS battery units.',
        },
        {
          step: '04',
          title: 'Backup, Repair vs. Replace & E-Waste',
          explanation:
            'Compare part cost + technician hours + lost user downtime against a new 4-year-cycle replacement machine. When retiring drives or lithium batteries, physically shred/cryptographically wipe authorized drives and log e-waste pickup certificates.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Safe Hardware Repair Checklist Before Touching a Screwdriver',
        asciiFallback: `[1. Backup User Data First!] -> [2. Check Serial / Warranty RMA?] -> [3. Unplug Mains + ESD Strap]
                                                                               |
[6. E-Waste / Asset Update] <--- [5. Change ONE Part + Log] <--- [4. Never Open PSU / Edge Hold]`,
      },
      workedExample: {
        title: 'Hardware vs. Software Proof via USB Live Boot',
        context: 'In an interview: "A laptop crashes randomly with freezes—how do you prove whether it is Windows corruption or bad hardware?"',
        steps: [
          'Check S.M.A.R.T. drive diagnostics and built-in UEFI vendor memory stress test (outside Windows completely!).',
          'Boot from a known-good diagnostic USB environment (WinPE / Ubuntu live USB): if crashes stop entirely on USB -> Windows OS/drivers are corrupt; if freezes still happen inside UEFI/USB -> hardware fault (RAM, overheating, or motherboard).',
          'Before swapping any SSD or returning under warranty RMA, copy user Desktop/Documents safely to approved storage.',
        ],
        outcome: 'Clean proof separates software bugs from physical RMA faults without guessing.',
      },
    },

    supportWalkthrough: {
      intro: 'Protect user files, warranties, and your own fingers on every physical bench ticket.',
      steps: [
        {
          phase: 'Never Wipe Without Auth',
          action: 'Even on a failing clicking HDD, attempt read-only data recovery backup before shipping RMA.',
          whyItWorks: 'Hard drives don’t care about ticket urgency—a failing disk might spin up one last time for critical files.',
        },
      ],
      questionsToAsk: [
        '"Have you backed up everything locally outside OneDrive/network shares recently?"',
        '"Could you read me the Service Tag or Serial Number on the bottom sticker?"',
      ],
      sampleUserWording: [
        {
          situation: 'Explaining a warranty RMA swap calmly',
          sayThis:
            '"Your laptop’s built-in diagnostics confirmed a faulty storage module, and the good news is it’s fully covered under vendor warranty. Before we swap or send it in, let’s double-check all local files are backed up safely."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Hardware -> Failing Storage / Vendor RMA',
        priorityFormula: 'Impact: Low (1 user) × Urgency: High (Clicking drive = imminent loss) = P2 High',
        internalNotes: `[DIAGNOSTICS] Laptop Serial ABC9921 showing S.M.A.R.T. Reallocated Sector warning + faint mechanical click on legacy 2nd HDD.
[DATA SAFETY] Backed up 14 GB local Desktop archive to encrypted company backup volume; verified file hashes.
[WARRANTY] Checked vendor portal -> ProSupport active through 2027 -> Opened RMA #RMA-44810 and updated CMDB asset status to Pending Repair.`,
        customerReply:
          'Hi Maya — We caught your secondary drive warning early, safely backed up all 14 GB of your local files, and submitted a warranty replacement arriving tomorrow morning. You have a loaner laptop ready at Desk 2 in the meantime.',
        escalationCriteria:
          'Stop immediately and escalate to specialized data-recovery vendors if critical unbacked legal/finance files live on a clicking disk.',
      },
    },

    commonTraps: [
      {
        trap: 'Opening a desktop Power Supply Unit (PSU) fan grille to poke around capacitors.',
        reality:
          'PSU capacitors hold dangerous high voltage long after wall plugs are pulled—replace PSUs as sealed units ONLY.',
      },
      {
        trap: 'Tossing dead lithium-ion laptop batteries into the office trash bin.',
        reality:
          'Swollen or punctured lithium batteries ignite fiercely—route ALL old batteries and electronics through certified **e-waste** recycling.',
      },
    ],

    keyTerms: [
      {
        term: 'ESD (Electrostatic Discharge)',
        shortDef: 'Static electricity zap from your fingers that silently damages sensitive microchips.',
        fullDef:
          'Prevented using grounded ESD wrist straps, anti-static mats, and touching bare unpainted chassis metal first.',
      },
      {
        term: 'S.M.A.R.T.',
        shortDef: 'Self-Monitoring, Analysis, and Reporting Technology built into SSDs and HDDs to predict failure.',
        fullDef:
          'Warns of failing sectors and temperature spikes before complete drive death—treat S.M.A.R.T. warnings as urgent backup triggers.',
      },
      {
        term: 'RMA (Return Merchandise Authorization)',
        shortDef: 'Formal vendor approval number to repair or exchange faulty hardware under warranty.',
        fullDef:
          'Requires checking serial numbers, attaching diagnostic proof, and wiping/removing confidential company drives if policy requires.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-261-q1',
        prompt: 'Which internal desktop component must an IT support technician NEVER open for internal board repair?',
        options: [
          'A desktop Power Supply Unit (PSU), because high-voltage capacitors retain dangerous charge even when unplugged.',
          'A desktop RAM slot latch.',
          'A removable front dust filter.',
          'An external USB hub plastic stand.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: PSUs are field-replaceable sealed assemblies—never crack open a power supply enclosure.',
          'Incorrect: RAM is safely serviced with ESD precautions.',
          'Incorrect: Dust filters are made to be cleaned.',
          'Incorrect: Low-voltage accessory.',
        ],
        takeaway: 'Never open a PSU; always unplug mains power and use ESD grounding first.',
      },
      {
        id: 'itsup-261-q2',
        prompt: 'In an interview, you are asked: "How do you decide whether a weird crash is a hardware fault or an OS software bug?" What is the cleanest method?',
        options: [
          'Test outside the installed OS—run built-in UEFI hardware diagnostics (memory/S.M.A.R.T.) or boot from a known-good live USB environment.',
          'Wipe the user’s drive without checking first.',
          'Buy a brand-new laptop immediately.',
          'Reset the user’s office phone password.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Running outside the suspect Windows install proves cleanly whether hardware fails on its own or only inside that OS.',
          'Incorrect: Destructive guesswork.',
          'Incorrect: Wasteful before isolating.',
          'Incorrect: Unrelated.',
        ],
        takeaway: 'Isolate hardware vs software by testing outside the OS (UEFI diagnostics or live USB boot).',
      },
      {
        id: 'itsup-261-q3',
        prompt: 'Before opening a fleet laptop or swapping an internal part, what two non-technical steps must come first?',
        options: [
          'Back up critical user data first AND check Serial/Service Tag warranty status.',
          'Install five games and erase the BitLocker key.',
          'Throw old laptop batteries in standard office paper bins.',
          'Swap three parts at once without taking notes.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Data preservation and warranty checks prevent catastrophic data loss and voided free RMA coverage.',
          'Incorrect: Harmful and risky.',
          'Incorrect: Lithium batteries require certified e-waste handling.',
          'Incorrect: Always change one part at a time and document.',
        ],
        takeaway: 'Data backup first, warranty check second, one change at a time third.',
      },
      {
        id: 'itsup-261-q4',
        prompt: 'A 5-year-old desktop out of warranty needs a $320 motherboard plus 3 hours of bench labor while a new fleet workstation costs $550. What guides the decision?',
        options: [
          'Repair-vs-replace math weighing part cost, labor, device age, and user downtime toward replacing with a new unit.',
          'Always repair every machine no matter the age or cost.',
          'Never update asset records when replacing hardware.',
          'Give the user a broken machine back without saying anything.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Business IT evaluates total cost of repair, remaining lifespan, and productivity downtime.',
          'Incorrect: Pouring $400+ into a 5-year out-of-warranty PC is poor stewardship.',
          'Incorrect: Always update CMDB/asset records on retirement/swap.',
          'Incorrect: Unhelpful.',
        ],
        takeaway: 'Weigh repair cost + labor + downtime + remaining life against fresh replacement.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Walk Through Five Bench Isolation Cases',
      instructions: [
        'Write exact first-three-step actions for: (1) Black screen, (2) Dead power, (3) Crawling drive with faint click, (4) 3-beep memory POST loop, (5) Thermal overheating throttle.',
      ],
      verificationCheck: 'Every plan enforces backup-first, unplug/ESD safety, and one-change-at-a-time swaps.',
    },

    summaryBullets: [
      'Protect hardware and yourself: unplug mains power, ground for ESD, hold edges only, and NEVER open a PSU.',
      'Back up user data BEFORE any repair and check Serial/Service Tag warranty status before opening sealed gear.',
      'Isolate faults with one change at a time: check UEFI diagnostics / live USB to prove hardware vs. software.',
      'Act fast on S.M.A.R.T. warnings or clicking drives before total platter/flash failure.',
      'Evaluate repair vs. replace economics and route batteries and dead parts cleanly through certified e-waste.',
    ],

    sourcesToVerify: [
      'CompTIA A+ Core 1 & Core 2 — ESD, Safety, Disposal & Hardware Isolation Procedures',
      'OSHA / Electronics Recycling Guidelines — Safe Handling of Lithium-Ion Batteries & PSUs',
    ],
  },

  'itsup.3.1.2': {
    id: 'itsup.3.1.2',
    moduleId: 'it-support',
    unitTitle: 'Unit 3: Operating Systems',
    topicTitle: '3.1 What an Operating System Does',
    code: '3.1.2',
    title: 'OS Core (Kernel, Drivers, Processes), Windows 10 EOS, Windows 11 Reqs, Home vs Pro vs Enterprise, 32/64-Bit & VMs',
    readMinutes: 10,
    prerequisites: ['2.6.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Explain how an OS manages hardware (kernel, drivers), active processes, UI, file systems, and user security across Windows, macOS, Linux, ChromeOS, iOS, and Android.',
      'Contrast Windows 10 (October 2025 end of support) and Windows 11 hardware prerequisites (supported CPU, TPM 2.0, Secure Boot).',
      'Compare Windows Home vs. Pro vs. Enterprise features relevant to business IT (domain join, BitLocker management, Remote Desktop host).',
      'Explain 32-bit vs. 64-bit RAM boundaries (>4 GB) and use Virtual Machines (`winver`, `systeminfo`) as risk-free practice labs.',
    ],

    whyThisMatters: {
      scenarioTitle: '"Why Can’t My Cheap Laptop Join the Office Network or Host Remote Desktop?"',
      narrative:
        'A small branch buys three discounted retail laptops without checking editions. On Day 1 IT discovers they run **Windows 11 Home**, not **Pro**: they cannot join a corporate directory domain, lack centrally managed BitLocker controls, and cannot accept incoming Remote Desktop sessions. Knowing OS fundamentals (`winver`, edition splits, Windows 10 Oct 2025 EOS, and 64-bit requirements) stops expensive procurement mistakes before devices leave the box.',
    },

    plainEnglish: {
      analogyTitle: 'The Orchestra Conductor Between Sheet Music (Apps) and Instruments (Hardware)',
      analogy:
        'Word, Excel, and your web browser do not know how to talk directly to an NVMe chip or Wi-Fi radio. The **Operating System kernel** acts like a master conductor, using **drivers** as instrument translators so 50 running programs (**processes**) share memory, screens, and disks safely without trampling each other.',
      technicalDefinition:
        'An operating system abstracts physical hardware through kernel scheduling and device drivers, enforces per-user security boundaries, hosts desktop/mobile execution across 64-bit (>4 GB RAM) architectures, and separates consumer editions (Home) from centrally manageable business tiers (Pro/Enterprise).',
      paragraphs: [
        'Microsoft reached **Windows 10 End of Support in October 2025**, so modern fleets deploy **Windows 11**—which demands a supported modern processor, **TPM 2.0**, and **Secure Boot** enabled in UEFI—though you will still encounter lingering Windows 10 endpoints during migrations.',
        'The classic business interview question: **Windows Home vs. Pro**! Home is strictly consumer software; **Pro** (and Enterprise for large fleets) unlocks **company domain joining**, **BitLocker disk encryption**, **Group Policy**, and **Remote Desktop hosting**.',
        'Finally, remember **32-bit vs. 64-bit**: 32-bit systems cap usable RAM around ~4 GB, whereas **64-bit** architectures run modern memory-hungry apps smoothly. And to practice everything risk-free on your home computer, spin up a **Virtual Machine (VM)**—an isolated software computer inside a window where mistakes cost nothing!',
      ],
    },

    deepDive: {
      intro: 'Compare OS layers, Windows editions, and safe VM practice workflows.',
      steps: [
        {
          step: '01',
          title: 'Five Core Jobs of Every OS',
          explanation:
            'Hardware abstraction (kernel + drivers), multitasking (processes/threads), file organization (file systems), human interface (GUI/shell), and multi-user security enforcement.',
        },
        {
          step: '02',
          title: 'Windows 10 EOS & Windows 11 Checks',
          explanation:
            'Check version/build fast via **`winver`** (concise dialog) or **`systeminfo`** (OS build, install date, BIOS version, total physical memory, domain, hotfixes). Verify Windows 11 readiness before upgrades: supported CPU, TPM 2.0, Secure Boot, GPT partition.',
        },
        {
          step: '03',
          title: 'Home vs. Pro vs. Enterprise Business Split',
          explanation:
            'Home: zero AD domain join, no local BitLocker management, no RDP host (client only). Pro: full domain join, BitLocker, Group Policy (`gpedit.msc`), Hyper-V, RDP host. Enterprise: adds DirectAccess/AppLocker/VDI/long-term servicing features.',
        },
        {
          step: '04',
          title: 'Virtual Machines (Safe Practice Sandboxes)',
          explanation:
            'Tools like VirtualBox, VMware Workstation Player, or Hyper-V let beginners install Windows 11 or Ubuntu Linux inside a VM snapshot, break the Registry or firewall on purpose, and roll back in 5 seconds.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Operating System Architecture & Edition Gate',
        asciiFallback: `[Applications: Browser, Office]
             |
   [OS Interface + Security Permissions]
             |
   [OS Kernel + Device Drivers] ---> [Physical Hardware: CPU, 64-bit RAM >4GB, TPM 2.0]

Windows Home  ---> Consumer only (No Domain Join, No BitLocker, No RDP Host)
Windows Pro+  ---> Business ready (Domain Join, BitLocker, Group Policy, RDP Host)`,
      },
      workedExample: {
        title: 'Diagnosing an Incompatible Upgrade & Edition Mismatch via `winver` + `systeminfo`',
        context: 'Contractor’s personal laptop cannot host RDP or join the branch setup; second older PC fails Windows 11 upgrade.',
        steps: [
          'Press `Win + R` -> type `winver` -> Contractor laptop shows "Windows 11 Home" -> Explain cleanly why a Pro upgrade key/license is required for domain join & RDP hosting.',
          'Run `systeminfo` on older PC -> Reveals Legacy BIOS mode (not UEFI) and no TPM 2.0 detected -> Confirms why Win 11 hardware check blocked the upgrade cleanly.',
        ],
        outcome: 'Clear procurement and upgrade decisions backed by exact command output.',
      },
    },

    supportWalkthrough: {
      intro: 'Always capture exact OS build (`winver` / `systeminfo`) early in any ticket.',
      steps: [
        {
          phase: 'Check OS Version First',
          action: 'Ask user to run `winver` (Win+R -> `winver`) and read the second line (e.g., Windows 11 Pro 24H2).',
          whyItWorks: 'Instantly flags Home-edition gaps, outdated unpatched builds, or OS platform differences.',
        },
      ],
      questionsToAsk: [
        '"If you press Windows key + R and type winver, does it say Windows 10 or 11, and Home or Pro?"',
      ],
      sampleUserWording: [
        {
          situation: 'Explaining why a Home laptop lacks Remote Desktop hosting',
          sayThis:
            '"Windows Home lets you connect OUT to another machine, while hosting incoming Remote Desktop connections—or joining our company network directory—requires Windows Pro."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Operating Systems -> Edition & Upgrade Check',
        priorityFormula: 'Impact: Low (1 device) × Urgency: Low = P4 Low',
        internalNotes: `[CHECK] Ran winver & systeminfo on contractor laptop. Confirmed Windows 11 Home 64-bit (cannot join domain or host RDP).
[ACTION] Routed Pro edition upgrade key request to Procurement / Software Licensing team.`,
        customerReply:
          'Hi Maya — We checked your system info and noticed your device came with Windows 11 Home, which lacks business network join and Remote Desktop hosting. I’ve submitted an upgrade request to move you to Pro.',
        escalationCriteria:
          'Route Windows Home -> Pro SKU licensing approvals to Software Asset / Procurement.',
      },
    },

    commonTraps: [
      {
        trap: 'Trying to join a Windows 11 Home laptop to a corporate Active Directory domain.',
        reality:
          'Home edition physically removes Domain Join, Group Policy, and BitLocker controls—upgrade the edition SKU to Pro first.',
      },
      {
        trap: 'Assuming an older Windows 10 PC will automatically upgrade cleanly to Windows 11 without checking hardware.',
        reality:
          'Windows 11 enforces TPM 2.0, Secure Boot, UEFI/GPT partitioning, and a supported 64-bit CPU—verify with `systeminfo` and Microsoft’s compatibility requirements first.',
      },
    ],

    keyTerms: [
      {
        term: 'Kernel, Driver & Process',
        shortDef: 'OS core scheduler (kernel), hardware translator (driver), and active running program (process).',
        fullDef:
          'Every running app becomes one or more isolated processes supervised by the OS kernel.',
      },
      {
        term: 'Windows Home vs. Pro',
        shortDef: 'Consumer tier (Home) vs. business tier adding Domain Join, BitLocker, Group Policy & RDP host (Pro).',
        fullDef:
          'Core day-one help desk interview distinction.',
      },
      {
        term: 'Virtual Machine (VM)',
        shortDef: 'A software computer running safely inside an existing host OS using virtualized hardware.',
        fullDef:
          'Essential zero-risk lab sandbox for practicing OS repairs, Linux, and imaging.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-312-q1',
        prompt: 'Which three business capabilities does Windows Pro add over Windows Home?',
        options: [
          'Joining a corporate directory domain, centrally managed BitLocker encryption, and Remote Desktop hosting.',
          'Ability to run a web browser and Microsoft Word.',
          'Higher monitor refresh rates.',
          'Support for USB mice.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Domain join, Group Policy/BitLocker management, and RDP hosting define Windows Pro over Home.',
          'Incorrect: Both run browsers and Office apps.',
          'Incorrect: Refresh rates depend on GPU and monitor hardware.',
          'Incorrect: Both support standard USB peripherals.',
        ],
        takeaway: 'Windows Pro = Domain join + BitLocker + Group Policy + RDP host.',
      },
      {
        id: 'itsup-312-q2',
        prompt: 'What key limitation makes 32-bit operating systems obsolete for modern office computers?',
        options: [
          '32-bit architectures cannot effectively address more than ~4 GB of RAM and cannot run 64-bit applications.',
          '32-bit Windows cannot connect to Wi-Fi.',
          '32-bit systems block printers.',
          '32-bit limits hard drives to 4 MB.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Modern browsers and Teams easily exceed 4 GB RAM, making 64-bit essential.',
          'Incorrect: 32-bit OSes support Wi-Fi.',
          'Incorrect: Printers work on 32-bit with 32-bit drivers.',
          'Incorrect: The 4 GB limit applies to RAM addressing (and FAT32 single file size, not 4 MB disks).',
        ],
        takeaway: '64-bit architectures unlock >4 GB RAM and run modern 64-bit business apps.',
      },
      {
        id: 'itsup-312-q3',
        prompt: 'Which three hardware/firmware requirements must a PC satisfy to run official Windows 11?',
        options: [
          'A supported 64-bit CPU, TPM 2.0 enabled, and UEFI Secure Boot enabled.',
          'An optical DVD burner, VGA monitor, and 2 GB RAM.',
          'A mechanical spinning HDD only.',
          'Disabled UEFI firmware.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Supported CPU + TPM 2.0 + Secure Boot (plus 4 GB+ RAM / 64 GB+ storage) gate official Windows 11.',
          'Incorrect: DVD/VGA are obsolete legacy parts.',
          'Incorrect: SSDs are preferred.',
          'Incorrect: UEFI mode (not Legacy BIOS) is required.',
        ],
        takeaway: 'Windows 11 checks: Supported 64-bit CPU + TPM 2.0 + UEFI Secure Boot.',
      },
      {
        id: 'itsup-312-q4',
        prompt: 'Which quick Windows command prints exact OS edition, build, BIOS date, total physical RAM, and installed hotfix list in one terminal screen?',
        options: [
          'systeminfo',
          'ipconfig /all',
          'ping 127.0.0.1',
          'whoami',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `systeminfo` (alongside `winver` GUI) gives a complete machine snapshot attachable to tickets.',
          'Incorrect: Shows network adapters only.',
          'Incorrect: Tests local loopback stack only.',
          'Incorrect: Shows active signed-in username.',
        ],
        takeaway: 'Use `winver` for fast user checks and `systeminfo > info.txt` for full ticket attachments.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Check OS Info (`winver`/`systeminfo`) & Explore a VM',
      instructions: [
        'Run `winver` and `systeminfo` on your machine; verify whether you run Windows 11 Pro or Home (or check your OS specs).',
        'Download/review setup steps for a free Ubuntu or Windows evaluation VM so you have a safe sandbox to break and fix things.',
      ],
      verificationCheck: 'Can state exact OS version, build, RAM, and edition off your screen cleanly.',
    },

    summaryBullets: [
      'The OS kernel + drivers let active app processes share hardware safely while enforcing security.',
      'Windows 10 reached end of support in October 2025; Windows 11 requires supported CPUs, TPM 2.0, and Secure Boot.',
      'Windows Pro/Enterprise add corporate domain join, BitLocker management, Group Policy, and RDP hosting over Home.',
      '64-bit operating systems remove the ~4 GB RAM ceiling and run modern 64-bit apps.',
      'Use `winver` / `systeminfo` for instant diagnostics and VMs for safe hands-on OS experimentation.',
    ],

    sourcesToVerify: [
      'Microsoft Learn — Windows 11 Hardware Specifications & Edition Comparisons',
      'Microsoft Lifecycle Policy — Windows 10 End of Support (October 2025)',
    ],
  },

  'itsup.3.2.1': {
    id: 'itsup.3.2.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 3: Operating Systems',
    topicTitle: '3.2–3.3 Daily Windows GUI Tools, CMD & PowerShell',
    code: '3.2.1',
    title: 'Windows Daily Console Suite (Run Shortcuts, regedit Safety, Resource/Reliability Monitor) & CMD / PowerShell Cmdlets',
    readMinutes: 14,
    prerequisites: ['3.1.1', '3.1.2'],
    versionScope: 'shared',

    learningObjectives: [
      'Launch core Windows GUI tools rapidly via Run (`Win+R`): `appwiz.cpl`, `ncpa.cpl`, `devmgmt.msc`, `services.msc`, `diskmgmt.msc`, `eventvwr.msc`, `msinfo32`, `msconfig`, Resource & Reliability Monitor.',
      'Explain Registry Editor (`regedit`) export/backup precautions before ever touching a Registry key.',
      'Execute daily Command Prompt commands (`cd`, `dir`, `copy`, `del`, `tasklist`, `taskkill`, `net use`, `shutdown /r /t 0`, `chkdsk`, `> output.txt`) safely.',
      'Use PowerShell `Verb-Noun` cmdlets and pipelines (`Get-Process`, `Get-Service`, `Restart-Service`, `Get-WinEvent`, `Test-NetConnection -Port`, `Get-ComputerInfo`, `Get-Help`, `| Where-Object`).',
    ],

    whyThisMatters: {
      scenarioTitle: 'Clicking Five Settings Menus vs. Solving in Ten Seconds via `Win+R` & PowerShell',
      narrative:
        'A remote user has a hung background process pinning 99% CPU, a yellow warning triangle on an audio driver, and needs `systeminfo` attached to an escalation ticket. Clicking slowly through nested Settings panels takes five minutes while the user waits. Pressing `Win+R` (`devmgmt.msc`, `ncpa.cpl`, `taskmgr`) or running `Get-Service | Where-Object Status -eq Stopped` and `systeminfo > diag.txt` makes you fast, exact, and unshakeable.',
    },

    plainEnglish: {
      analogyTitle: 'Shortcut Keys on a Soundboard vs. Hunting Inside Backstage Closets',
      analogy:
        'Windows Settings hides deep administrative tools behind changing menus. **`Win + R`** shortcuts are labeled buttons on a mixing board that teleport you directly to Hardware Drivers (`devmgmt.msc`), Network Adapters (`ncpa.cpl`), or Disk Partitions (`diskmgmt.msc`) on *every* Windows version. And PowerShell’s **pipe (`|`)** works like an assembly line: tool #1 hands a list of services straight to tool #2 to filter only the stopped ones!',
      technicalDefinition:
        'Effective Windows administration combines `.msc`/`.cpl` management snap-ins, non-destructive telemetry (Reliability Monitor, Resource Monitor, Event Viewer), Command Prompt utilities with output redirection (`>`), and object-oriented PowerShell `Verb-Noun` pipelines under least-privilege elevation.',
      paragraphs: [
        'Know your **`Win + R` shortcuts** cold: `appwiz.cpl` (classic Programs & Features uninstall), `ncpa.cpl` (Network Connections), `devmgmt.msc` (Device Manager—yellow `!` = bad/missing driver -> update/roll back/uninstall), `services.msc`, `diskmgmt.msc`, `eventvwr.msc`, `msinfo32` (System Info), `msconfig`, plus **Resource Monitor** and **Reliability Monitor** (instant visual crash timeline!).',
        'Before editing **`regedit` (Registry Editor)**—the live hierarchical database of OS & app settings—always right-click the branch -> **Export `.reg` backup** first! Never improvise Registry edits.',
        'In terminals: know when you need **Run as administrator** (elevated) vs. standard prompt. Always read scripts before pasting, test on *one* machine first, and save output directly to ticket attachments with `command > output.txt`.',
      ],
    },

    deepDive: {
      intro: 'Pair rapid Windows GUI shortcuts with CMD redirection and PowerShell Verb-Noun pipelines.',
      steps: [
        {
          step: '01',
          title: 'Daily GUI Toolbox (`Win+R` + Task/Reliability/Resource Monitors)',
          explanation:
            '`Ctrl + Shift + Esc` opens Task Manager (Processes, CPU/RAM/Disk/Net, Startup apps, Users). Device Manager (`devmgmt.msc`) fixes yellow `!` hardware drivers. Disk Management (`diskmgmt.msc`) inspects partitions and missing drive letters. Reliability Monitor plots app crashes/updates on an easy 1–10 daily timeline.',
        },
        {
          step: '02',
          title: 'Command Prompt Workhorses & `> output.txt`',
          explanation:
            'Navigation/files (`cd`, `dir`, `copy`, `del`), diagnostics (`whoami`, `hostname`, `systeminfo`, `ipconfig /all`, `ping`, `tracert`, `nslookup`, `netstat -ano`), processes (`tasklist`, `taskkill /IM app.exe /F`), shares (`net use Z: \\\\srv\\share`), repair (`sfc /scannow`, `DISM /Online /Cleanup-Image /RestoreHealth`, `chkdsk C:`), and clean reboot (`shutdown /r /t 0`). Add `> C:\\Temp\\diag.txt` to save output!',
        },
        {
          step: '03',
          title: 'PowerShell `Verb-Noun` & Pipe (`|`) Magic',
          explanation:
            'Every cmdlet follows `Verb-Noun`: `Get-Process`, `Get-Service`, `Restart-Service Spooler`, `Get-WinEvent -LogName System -MaxEvents 20`, `Get-ComputerInfo`, `Get-Help <cmd>`, and `Test-NetConnection -ComputerName mail.company.com -Port 443` (proves TCP port reachability cleanly!). Filter via pipe: `Get-Service | Where-Object Status -eq Stopped`.',
        },
        {
          step: '04',
          title: 'Least-Privilege Elevation & Script Safety',
          explanation:
            'Do not live inside elevated admin prompts all day—elevate only when restarting services or repairing system files. Never paste destructive delete/bulk commands onto fleet machines before verifying on one test endpoint.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Windows GUI Shortcuts + PowerShell Pipeline Reference',
        asciiFallback: `Win+R Shortcuts: appwiz.cpl (Programs) | ncpa.cpl (NICs) | devmgmt.msc (Drivers)
                 services.msc (Bg Svcs)| diskmgmt.msc (Disks) | eventvwr.msc (Logs)

PowerShell Pipe: [Get-Service] --(objects)--> [| Where-Object Status -eq Stopped]`,
      },
      workedExample: {
        title: 'Inspecting Crashes, Testing Port 443 & Saving Output to a Ticket',
        context: 'User says internal portal fails and an app freezes daily.',
        steps: [
          'Open Reliability Monitor (search `Reliability`) -> immediately spots Outlook crashing right after PDF plugin update Tuesday at 10:12 AM.',
          'Open PowerShell -> run `Test-NetConnection -ComputerName portal.corp.local -Port 443` -> confirms `TcpTestSucceeded : True`.',
          'Capture baseline into file: `systeminfo > C:\\Temp\\pc-info.txt` -> attach clean `.txt` file directly to the ticket note.',
        ],
        outcome: 'Pinpointed exact crash date, proved firewall port 443 open, and attached clean diagnostics in 90 seconds.',
      },
    },

    supportWalkthrough: {
      intro: 'Teach callers `Win+R` or `Ctrl+Shift+Esc` smoothly—they work identically across Windows 10 and 11.',
      steps: [
        {
          phase: 'Reliability Monitor First',
          action: 'Ask user to press Start and type "reliability" -> click "View reliability history" for instant red-X crash dates.',
          whyItWorks: 'Faster for beginners to read than raw Event Viewer XML trees.',
        },
        {
          phase: 'Never Edit Registry Blind',
          action: 'Export a `.reg` backup of any parent key before changing a single value.',
          whyItWorks: 'Double-clicking the exported `.reg` file rolls back accidental typos immediately.',
        },
      ],
      questionsToAsk: [
        '"If you press Ctrl+Shift+Esc, which app sits at the top of CPU or Memory usage right now?"',
      ],
      sampleUserWording: [
        {
          situation: 'Saving terminal diagnostics without reading 80 lines over the phone',
          sayThis:
            '"Let’s type `systeminfo > Desktop\\info.txt` and hit Enter—then you can attach that small text file straight to our chat!"',
        },
      ],
      ticketNoteTemplate: {
        category: 'Operating Systems -> Process / Driver Repair',
        priorityFormula: 'Impact: Low (1 PC) × Urgency: Medium = P3 Medium',
        internalNotes: `[GUI & CLI CHECKS] Reliability Monitor flagged faulting audio driver Tuesday 10:15 AM. Device Manager showed yellow warning badge on High Definition Audio.
[ACTION] Rolled back driver via devmgmt.msc; exported systeminfo > diag.txt; verified Get-Service Audiosrv Running.
[RESULT] Clean microphone test verified by user.`,
        customerReply:
          'Hi Jordan — Rolling back Tuesday’s automatic audio driver update cleared the warning and restored your microphone. We attached your diagnostic summary to the ticket for reference.',
        escalationCriteria:
          'Escalate if `sfc /scannow` + `DISM` fail to repair corrupt OS system files or `chkdsk` reports unrecoverable bad sectors.',
      },
    },

    commonTraps: [
      {
        trap: 'Editing `regedit` directly without exporting a `.reg` backup first.',
        reality:
          'One wrong Registry deletion can break Windows boot or sign-in permanently. Export before editing—always.',
      },
      {
        trap: 'Running `ping` to prove an HTTPS web server (Port 443) is open.',
        reality:
          'Firewalls often block ICMP ping while allowing HTTPS, or allow ping while blocking port 443! Use PowerShell `Test-NetConnection -Port 443` to test the real service port.',
      },
    ],

    keyTerms: [
      {
        term: 'Registry Editor (regedit)',
        shortDef: 'Hierarchical Windows database holding OS, driver, and application settings—export backup before edits.',
        fullDef:
          'Mistakes inside HKLM/HKCU can prevent boot or break user apps; back up the key first.',
      },
      {
        term: 'PowerShell Verb-Noun & Pipe (`|`)',
        shortDef: 'Consistent cmdlet naming (`Get-Service`) chained with `|` to pass structured objects to the next filter.',
        fullDef:
          'Unlike plain text shells, PowerShell passes full objects so `Where-Object` filters properties accurately.',
      },
      {
        term: 'Output Redirection (`>`)',
        shortDef: 'Sending terminal command output directly into a `.txt` file (`ipconfig /all > net.txt`) for ticket evidence.',
        fullDef:
          'Saves error-prone manual typing and preserves full timestamps/addresses.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-321-q1',
        prompt: 'Which PowerShell command verifies whether remote server `app.corp.local` actually accepts connections on TCP port 443?',
        options: [
          'Test-NetConnection -ComputerName app.corp.local -Port 443',
          'Get-Process -Port 443',
          'ipconfig /port443',
          'devmgmt.msc',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `Test-NetConnection -Port` runs a genuine TCP handshake on that exact port.',
          'Incorrect: `Get-Process` inspects local running executables.',
          'Incorrect: Invalid flag.',
          'Incorrect: Opens Device Manager GUI.',
        ],
        takeaway: 'Use PowerShell `Test-NetConnection -ComputerName ... -Port ...` for real port checks.',
      },
      {
        id: 'itsup-321-q2',
        prompt: 'Which `Win+R` command opens Device Manager directly to inspect a yellow warning icon on a broken driver?',
        options: [
          'devmgmt.msc',
          'appwiz.cpl',
          'diskmgmt.msc',
          'ncpa.cpl',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `devmgmt.msc` opens Device Manager.',
          'Incorrect: `appwiz.cpl` opens classic Programs and Features uninstall list.',
          'Incorrect: `diskmgmt.msc` opens Disk Management.',
          'Incorrect: `ncpa.cpl` opens Network Connections.',
        ],
        takeaway: 'Memorize core shortcuts: `devmgmt.msc`, `services.msc`, `diskmgmt.msc`, `ncpa.cpl`, `appwiz.cpl`, `eventvwr.msc`.',
      },
      {
        id: 'itsup-321-q3',
        prompt: 'What must an analyst ALWAYS do before modifying any key inside Windows Registry Editor (`regedit`)?',
        options: [
          'Right-click the key/branch and Export a `.reg` backup file first, and confirm clear documented instructions.',
          'Delete the whole HKEY_LOCAL_MACHINE folder first.',
          'Reboot into Factory Reset.',
          'Share the Registry in public chat.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Exporting a backup lets you restore the original values cleanly if anything misbehaves.',
          'Incorrect: Destroys Windows immediately.',
          'Incorrect: Unnecessary.',
          'Incorrect: Exposes machine config needlessly.',
        ],
        takeaway: 'Always Export a `.reg` backup before touching any Registry value.',
      },
      {
        id: 'itsup-321-q4',
        prompt: 'What does this PowerShell pipeline return? `Get-Service | Where-Object Status -eq Stopped`',
        options: [
          'A filtered list showing only Windows services whose current status is Stopped.',
          'It immediately kills every running program on the PC.',
          'It restarts the Print Spooler.',
          'It deletes system logs.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `Get-Service` passes service objects down `|` to `Where-Object`, filtering only `Stopped` items safely (read-only).',
          'Incorrect: `Get-Service` is read-only.',
          'Incorrect: `Restart-Service` handles restarts.',
          'Incorrect: No deletion happens.',
        ],
        takeaway: 'The PowerShell pipe `|` filters structured cmdlet objects cleanly without altering anything unless told.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Run Daily Shortcuts & Redirect `systeminfo` to a File',
      instructions: [
        'Open `Win+R` and launch `devmgmt.msc`, `services.msc`, `diskmgmt.msc`, `ncpa.cpl`, and `msinfo32`.',
        'Open PowerShell and run `Get-Service | Where-Object Status -eq Stopped` and `systeminfo > C:\\Temp\\sys.txt` (or Desktop path).',
      ],
      verificationCheck: 'Output file exists and opens cleanly showing build, memory, and BIOS summary.',
    },

    summaryBullets: [
      'Master `Win+R` jumps: `appwiz.cpl`, `ncpa.cpl`, `devmgmt.msc`, `services.msc`, `diskmgmt.msc`, `eventvwr.msc`, `msinfo32`, `msconfig`.',
      'Use Task Manager (`Ctrl+Shift+Esc`), Resource Monitor, and Reliability Monitor to spot crashes and hogs visually.',
      'Always export a `.reg` backup before editing Registry Editor (`regedit`) and test scripts on one PC first.',
      'Redirect diagnostic CLI output cleanly into ticket attachments with `command > output.txt`.',
      'Combine PowerShell `Verb-Noun` cmdlets (`Get-Service`, `Test-NetConnection -Port`, `Get-WinEvent`) with `|` filters.',
    ],

    sourcesToVerify: [
      'Microsoft Learn — Windows Sysinternals, MMC Snap-Ins & PowerShell Core Cmdlets',
      'CompTIA A+ Core 2 (220-1102) — Windows Command-Line & Administrative Tools',
    ],
  },

  'itsup.3.4.1': {
    id: 'itsup.3.4.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 3: Operating Systems',
    topicTitle: '3.4 macOS and Linux Essentials',
    code: '3.4.1',
    title: 'macOS Support (Finder, Activity Monitor, Disk Utility, Keychain, FileVault, Gatekeeper) & Linux CLI (apt/dnf, df -h, systemctl, /var/log)',
    readMinutes: 13,
    prerequisites: ['3.1.2', '3.2.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Navigate core macOS diagnostic tools: Finder, System Settings, Activity Monitor, Disk Utility First Aid, Keychain Access, Time Machine, FileVault, and Gatekeeper.',
      'Run essential macOS Terminal commands (`ls`, `cd`, `pwd`, `sudo`, `ping`, `ifconfig`, `diskutil list`, `softwareupdate -l`) and Recovery/Safe Mode.',
      'Identify major Linux distributions (Ubuntu, Debian, RHEL, Fedora) and install/update software with `apt` or `dnf`.',
      'Diagnose Linux disk, memory, network, services, and logs via `df -h`, `free -h`, `ip addr`, `ps`/`top`, `grep`, `systemctl`, `journalctl`, `/var/log`, and `man`.',
    ],

    whyThisMatters: {
      scenarioTitle: 'Mixed Fleet Reality: Marketing Runs MacBooks, Dev Runs Ubuntu!',
      narrative:
        'A designer’s MacBook refuses to open an internal utility ("unidentified developer") and asks for Keychain passwords after a reset, while a developer’s Ubuntu workstation runs out of disk space so Docker and local builds crash. You do not need to be a Linux kernel hacker to support mixed fleets—just knowing the macOS equivalents of Windows tools and 15 everyday Linux commands lets you handle both platforms calmly.',
    },

    plainEnglish: {
      analogyTitle: 'Same House Rooms, Different Door Signs Across Windows, Mac, and Linux',
      analogy:
        'Once you learn Windows Task Manager, Disk Management, BitLocker, and Services, you already understand macOS and Linux—you only translate the signs on the doors! Windows Task Manager = macOS **Activity Monitor** = Linux **`top` / `ps`**. BitLocker = macOS **FileVault**. Windows Services = Linux **`systemctl`**. Event Viewer = macOS Console / Linux **`journalctl` & `/var/log`**.',
      technicalDefinition:
        'Cross-platform help desk proficiency maps core Windows diagnostic concepts (process monitor, disk/file repair, encryption, credential store, service daemon control, package managers, and system logs) onto macOS graphical/BSD utilities and Linux POSIX shell tools.',
      paragraphs: [
        'On **macOS**: **Finder** replaces File Explorer; **Activity Monitor** replaces Task Manager; **Disk Utility (First Aid)** checks drive health; **Keychain Access** stores saved passwords/certs; **Time Machine** handles backups; **FileVault** handles full-disk encryption; **Gatekeeper** blocks unverified apps downloaded from the web (check System Settings -> Privacy & Security to allow approved software).',
        'On **Linux**: **Ubuntu / Debian** use **`apt`** (`sudo apt update && sudo apt install ...`), while **Red Hat Enterprise Linux (RHEL) / Fedora** use **`dnf`**. Most system logs live in **`/var/log`** and systemd service logs appear in **`journalctl`**.',
        'For interviews, memorize the two instant health commands: **`df -h`** checks disk space (`d`isk `f`ree human-readable) and **`free -h`** checks RAM! Check running processes with **`ps aux`** or **`top`**, and service health with **`systemctl status <service>`**.',
      ],
    },

    deepDive: {
      intro: 'Learn the exact macOS + Linux tool map and everyday CLI commands side by side.',
      steps: [
        {
          step: '01',
          title: 'macOS Graphical Suite & Safe/Recovery Boot',
          explanation:
            'Finder, System Settings, Activity Monitor (Force Quit / CPU / Memory), Disk Utility (First Aid repairs APFS structures), Keychain Access (clear stale saved Wi-Fi/app passwords), Time Machine, FileVault (save personal/institutional recovery key), Software Update. Hold Shift (Intel) or Power -> Options (Apple Silicon) for Safe Mode & Recovery.',
        },
        {
          step: '02',
          title: 'macOS Terminal Essentials',
          explanation:
            '`ls` (list), `cd` (change dir), `pwd` (current path), `sudo` (run as admin), `ping`, `ifconfig` (network IPs), `diskutil list` (disks/partitions), `softwareupdate -l` (pending macOS updates).',
        },
        {
          step: '03',
          title: 'Linux Distros, Packages & File Exploration',
          explanation:
            'Debian/Ubuntu (`apt`), RHEL/Fedora (`dnf`). Core file navigation: `ls`, `cd`, `pwd`, `cat`, `less`, `cp`, `mv`, `rm`, `mkdir`, `grep` (search text inside logs!), and `man <command>` (built-in manual page).',
        },
        {
          step: '04',
          title: 'Linux System Health, Services & Logs (Interview Favorites)',
          explanation:
            '`df -h` (disk space!), `free -h` (RAM!), `ps` & `top` (processes!), `ip addr` (network!), `systemctl status <svc>` & `sudo systemctl restart <svc>`, `journalctl -xe` (recent systemd logs), `/var/log/syslog` or `/var/log/messages`.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Windows <-> macOS <-> Linux Troubleshooting Translation Map',
        asciiFallback: `TASK MGR      <---> macOS: Activity Monitor      <---> Linux: top / ps aux
EVENT VIEWER  <---> macOS: Console / log show    <---> Linux: journalctl / /var/log
SERVICES.MSC  <---> macOS: launchctl             <---> Linux: systemctl status/restart
BITLOCKER     <---> macOS: FileVault             <---> Linux: LUKS
DISK MGMT     <---> macOS: Disk Utility / diskutil <-> Linux: df -h / lsblk
CREDENTIAL MGR<---> macOS: Keychain Access       <---> Linux: secret-tool / ssh-agent`,
      },
      workedExample: {
        title: 'Two Cross-Platform Support Wins in 3 Minutes',
        context: '(A) Mac user gets "App is damaged or cannot be opened because developer cannot be verified"; (B) Ubuntu dev box throws "No space left on device."',
        steps: [
          'Mac: Confirm app is company-approved in software catalog -> Guide user to System Settings -> Privacy & Security -> click "Open Anyway" under Gatekeeper notice (NEVER bypass Gatekeeper for unapproved random downloads!).',
          'Linux: SSH/Terminal in -> run `df -h` -> reveals `/` partition at `100%` filled by bloated old log files in `/var/log` -> compress/archive old rotated logs safely and run `systemctl restart` on the stalled app service -> `df -h` drops to `42%` and service turns `active (running)`.',
        ],
        outcome: 'Both Mac creative and Linux engineer back at full speed without escalations.',
      },
    },

    supportWalkthrough: {
      intro: 'Never bluff Mac or Linux fluency—know these clean inspection commands and verify safely.',
      steps: [
        {
          phase: 'Check Mac Keychain After Passwords',
          action: 'When a Mac loops login prompts after a password reset, inspect **Keychain Access** for stale saved entries.',
          whyItWorks: 'Matches clearing Windows Credential Manager—stale saved tokens cause most Mac password loops.',
        },
        {
          phase: 'Inspect `df -h` Before Blaming Linux Code',
          action: 'Always check `df -h` and `free -h` first when a Linux app suddenly crashes on save.',
          whyItWorks: 'A 100%-full `/var` or `/` filesystem causes bizarre seemingly unrelated app errors.',
        },
      ],
      questionsToAsk: [
        '"Are you seeing a Gatekeeper warning saying the app cannot be verified on your Mac?"',
        '"Could you run `df -h` and `systemctl status` on the failing Linux service and paste the lines here?"',
      ],
      sampleUserWording: [
        {
          situation: 'Explaining macOS FileVault calmly',
          sayThis:
            '"FileVault encrypts your Mac’s drive just like BitLocker on Windows, so even if your MacBook were stolen, nobody can read your files without your login or recovery key."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Operating Systems -> Linux / macOS Support',
        priorityFormula: 'Impact: Low (1 dev workstation) × Urgency: High (Blocked build) = P2 High',
        internalNotes: `[OS] Ubuntu 24.04 LTS dev workstation failing local service start.
[CHECKS] df -h showed / at 100% (48 GB in /var/log/app-debug.log); free -h normal (16 GB free).
[FIX] Cleared/rotated stale debug log per retention guide, ran sudo systemctl restart dev-api -> systemctl status active (running), df -h now 38%.`,
        customerReply:
          'Hi Jordan — Your Ubuntu workstation’s root disk had filled to 100% due to verbose debug logs. We rotated the oversized log and restarted the service—you’re back down to 38% disk usage and builds are running cleanly.',
        escalationCriteria:
          'Escalate kernel panics, APFS unrepairable Disk Utility errors, or production Linux server outages to L2/L3 Systems.',
      },
    },

    commonTraps: [
      {
        trap: 'Typing `sudo rm -rf` hastily inside Linux without double-checking current `pwd` path.',
        reality:
          'Linux does not ask "Are you sure?" when deleting under `sudo`—always check `pwd` and read the exact path before pressing Enter.',
      },
      {
        trap: 'Bypassing macOS Gatekeeper for random software downloaded from untrusted sites.',
        reality:
          'Verify software approval first—Gatekeeper protects Macs from trojans disguised as everyday utilities.',
      },
    ],

    keyTerms: [
      {
        term: 'macOS Gatekeeper & FileVault',
        shortDef: 'App signature/source checker (Gatekeeper) and macOS full-disk encryption (FileVault).',
        fullDef:
          'Core macOS security controls alongside Keychain Access (stored credentials) and Time Machine (backups).',
      },
      {
        term: '`df -h` & `free -h`',
        shortDef: 'Human-readable Linux commands showing mounted disk usage (`df -h`) and RAM/swap usage (`free -h`).',
        fullDef:
          'Top two day-1 Linux diagnostic commands asked in technical interviews.',
      },
      {
        term: '`systemctl` & `/var/log`',
        shortDef: 'Linux service controller (`status`/`restart`) and primary log folder (`/var/log`, plus `journalctl`).',
        fullDef:
          'Direct Linux equivalents to Windows `services.msc` and Event Viewer.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-341-q1',
        prompt: 'In an interview: "How do you check disk space and running processes on a Linux machine?"',
        options: [
          'Run `df -h` for human-readable disk space and `ps` (or `top`) for running processes.',
          'Run `ipconfig /all` and `taskmgr`.',
          'Open Windows Device Manager.',
          'Run `apt-get diskspace`.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `df -h` displays mounted partition free space; `ps` and `top` display active processes.',
          'Incorrect: Windows-only utilities.',
          'Incorrect: Windows GUI tool.',
          'Incorrect: `apt` manages software packages, not disk telemetry.',
        ],
        takeaway: 'Remember Linux essentials: `df -h` (disk), `free -h` (RAM), `ps`/`top` (processes), `ip addr` (IPs).',
      },
      {
        id: 'itsup-341-q2',
        prompt: 'Which two package managers update and install software on Ubuntu/Debian vs. Red Hat/Fedora?',
        options: [
          '`apt` on Ubuntu/Debian and `dnf` on Fedora/Red Hat.',
          '`winget` on Ubuntu and `msconfig` on Red Hat.',
          '`chkdsk` on Debian and `finder` on Fedora.',
          '`systemctl` on Ubuntu and `keychain` on Red Hat.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `.deb` families use `apt`; `.rpm` Red Hat/Fedora families use `dnf`.',
          'Incorrect: Windows commands.',
          'Incorrect: Windows/macOS tools.',
          'Incorrect: `systemctl` controls background services, not package downloads.',
        ],
        takeaway: 'Debian/Ubuntu -> `apt`; RHEL/Fedora -> `dnf`; Windows -> `winget`.',
      },
      {
        id: 'itsup-341-q3',
        prompt: 'What is the macOS equivalent of Windows Task Manager and BitLocker?',
        options: [
          'Activity Monitor (processes/performance) and FileVault (disk encryption).',
          'Finder and AirDrop.',
          'Gatekeeper and Time Machine.',
          'Safari and Keynote.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Activity Monitor tracks CPU/RAM/Quit apps; FileVault encrypts startup disks.',
          'Incorrect: Finder browses files; AirDrop shares wirelessly.',
          'Incorrect: Gatekeeper checks app developers; Time Machine makes backups.',
          'Incorrect: Productivity/browser apps.',
        ],
        takeaway: 'Map Windows <-> Mac: Task Manager = Activity Monitor; BitLocker = FileVault; Explorer = Finder.',
      },
      {
        id: 'itsup-341-q4',
        prompt: 'Where do most Linux system and service log files reside, and which command inspects systemd logs?',
        options: [
          '`/var/log` directory and `journalctl` (paired with `systemctl status` for service health).',
          '`C:\\Windows\\System32\\Logs` and `eventvwr.msc`.',
          '`/home/trash` and `top -logs`.',
          '`/etc/passwords` and `df -log`.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `/var/log` stores classic logs and `journalctl` queries systemd service output.',
          'Incorrect: Windows paths/commands.',
          'Incorrect: Fabricated commands.',
          'Incorrect: `/etc/passwd` holds account metadata, not service logs.',
        ],
        takeaway: 'Inspect `/var/log` (with `grep` / `less`) and `journalctl` when troubleshooting Linux.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Practice Linux CLI in an Ubuntu VM & Check macOS First Aid',
      instructions: [
        'In an Ubuntu/Linux VM (or WSL), run: `ls`, `pwd`, `df -h`, `free -h`, `ip addr`, `ps`, `top`, `systemctl status`, `journalctl -n 20`, and `ls /var/log`.',
        'If using macOS (or review screenshots), inspect Activity Monitor, Keychain Access, and `diskutil list`.',
      ],
      verificationCheck: 'Can explain the output of `df -h`, `free -h`, and `systemctl status` cleanly without looking up notes.',
    },

    summaryBullets: [
      'macOS troubleshooting relies on Finder, Activity Monitor, Disk Utility (First Aid), Keychain Access, FileVault, Time Machine, and Gatekeeper.',
      'Use macOS Terminal basics (`ls`, `cd`, `pwd`, `sudo`, `ifconfig`, `diskutil list`, `softwareupdate -l`) and Recovery/Safe modes.',
      'Ubuntu/Debian install software with `apt`; RHEL/Fedora use `dnf`.',
      'Core Linux health commands: `df -h` (disk), `free -h` (RAM), `ps`/`top` (CPU/procs), `ip addr` (network), `systemctl` (services).',
      'Search Linux logs inside `/var/log` using `less` / `grep` and inspect systemd events via `journalctl`.',
    ],

    sourcesToVerify: [
      'Apple Support — Mac Utilities: Activity Monitor, Disk Utility, FileVault & Gatekeeper',
      'Ubuntu & Red Hat Documentation — Core Shell Utilities, systemd & Package Management',
    ],
  },

  'itsup.3.5.1': {
    id: 'itsup.3.5.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 3: Operating Systems',
    topicTitle: '3.5 File Systems, Folders & Permissions',
    code: '3.5.1',
    title: 'File Systems (NTFS/FAT32/exFAT/APFS/ext4), User Profiles & AppData, Share vs NTFS Permissions & Linux chmod/chown',
    readMinutes: 12,
    prerequisites: ['3.1.1', '3.4.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Compare common file systems and spot compatibility or 4 GB file-size traps: NTFS, FAT32, exFAT, APFS, and ext4.',
      'Locate user profile folders (`C:\\Users\\...\\Documents/Desktop/AppData`, macOS `/Users`, Linux `/home`) for cleanup or backup.',
      'Resolve Windows folder access issues by evaluating inheritance, Deny overrides Allow, Effective Access, and Share vs. NTFS intersection.',
      'Explain and read Linux `rwx` permissions (`chmod 755` / `chmod 644`) and ownership changes (`chown`).',
    ],

    whyThisMatters: {
      scenarioTitle: '"Why Can’t I Copy a 6 GB Video to My USB Stick—and Why Did Yesterday’s Folder Lock Me Out?"',
      narrative:
        'A marketing coordinator tries copying a 6 GB presentation video onto an empty 64 GB flash drive and sees *"The file is too large for the destination file system."* Minutes later, another employee says *"I could open this shared folder yesterday, now I get Access Denied!"* Understanding **FAT32’s 4 GB file cap** vs. **exFAT**, hidden `AppData` paths, Share-vs-NTFS intersection, and Linux `755`/`644` stops file-access tickets cold.',
    },

    plainEnglish: {
      analogyTitle: 'Different Filing Cabinets (and Two Locked Doors Leading to One Room)',
      analogy:
        'Imagine **FAT32** as a vintage cabinet whose drawers physically refuse any folder thicker than 4 GB—no matter how empty the rest of the cabinet sits! Switching the USB drive to **exFAT** removes that drawer divider across both Windows and Mac. And remember: opening a network folder passes through **two doors**—the **Share permission** (hallway guard) and **NTFS permission** (room lock); whichever guard is **stricter** decides what you can do!',
      technicalDefinition:
        'File systems govern partition metadata, maximum file sizes, cross-OS portability, and granular ACLs (Windows NTFS + SMB Share vs. POSIX `rwx` user/group/other bits).',
      paragraphs: [
        'Five file systems to recognize immediately: **NTFS** (Windows system default—permissions & large files), **FAT32** (old universal format capped at **4 GB max single file!**), **exFAT** (modern cross-OS USB drives >4 GB on Windows + Mac), **APFS** (modern macOS), and **ext4** (standard Linux).',
        'Know where files live: Windows stores profiles in **`C:\\Users\\<name>`** (`Documents, Desktop, Downloads`) plus the hidden **`AppData`** folder holding app settings/caches (`AppData\\Local`, `AppData\\Roaming`). macOS uses **`/Users`**, and Linux uses **`/home`**.',
        'On Linux, every file/folder defines **Read (`r=4`), Write (`w=2`), Execute (`x=1`)** for **Owner, Group, Everyone else**. **`chmod 755`** gives Owner full `rwx` (`4+2+1=7`), and Group/Others `r-x` (`4+1=5`). **`chmod 644`** gives Owner `rw-` (`6`) and others read-only `r--` (`4`). **`chown`** changes file owner.',
      ],
    },

    deepDive: {
      intro: 'Diagnose file systems, profile paths, Windows share access, and Linux POSIX bits cleanly.',
      steps: [
        {
          step: '01',
          title: 'Five File Systems & The 4 GB FAT32 Trap',
          explanation:
            'Whenever an empty 32–128 GB flash drive refuses a >4 GB ISO or video file, check Properties -> File System: it’s formatted **FAT32**. Back up any contents on the USB stick first, then reformat to **exFAT** (for Windows + Mac portability) or **NTFS** (Windows-only with permissions).',
        },
        {
          step: '02',
          title: 'Windows NTFS Inheritance & Share vs. NTFS',
          explanation:
            'Permissions flow down from parent folders (inheritance). Explicit **Deny always overrides Allow**. Grant access to **groups**—not individual people! When connecting over `\\\\server\\share` (`net use Z: \\\\server\\share`), **the stricter permission between Share and NTFS wins**.',
        },
        {
          step: '03',
          title: 'Four Checks When "I Opened It Yesterday, Access Denied Today!"',
          explanation:
            'Interview favorite! Check: (1) Group membership changes (did someone move teams or remove a group? Remember sign-out/sign-in refreshes tokens!), (2) NTFS/Share permission or explicit Deny edits on the folder, (3) Network connectivity / path typo (`Path not found` vs `Access denied`), (4) Whether the folder/share was renamed, moved, or unshared.',
        },
        {
          step: '04',
          title: 'Linux Permissions (`rwx`, `755`, `644`, `chmod`, `chown`)',
          explanation:
            'In `ls -l`: `-rwxr-xr-x` = file (`-`), Owner `rwx` (7), Group `r-x` (5), Others `r-x` (5). Scripts & directories commonly use `755`; normal config/text files use `644`. Run `chmod 755 script.sh` or `sudo chown dev:devs app.conf`.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Windows Share + NTFS Effective Access vs Linux rwx Bits',
        asciiFallback: `Windows Network Share: [Share Perm: Read]  ∩  [NTFS Security: Modify]  ===> Effective: READ ONLY (Stricter Wins!)

Linux POSIX Bits:      r (4) + w (2) + x (1)
  chmod 755  --->  Owner: 4+2+1=7 (rwx) | Group: 4+0+1=5 (r-x) | Others: 4+0+1=5 (r-x)
  chmod 644  --->  Owner: 4+2+0=6 (rw-) | Group: 4+0+0=4 (r--) | Others: 4+0+0=4 (r--)`,
      },
      workedExample: {
        title: 'Solving "File Too Large" USB Error + Missing Linux Script Permission',
        context: '(A) 6 GB training video rejected by empty 64 GB USB drive; (B) Linux script returns "Permission denied" after copy.',
        steps: [
          'USB Stick: Right-click USB -> Properties -> File system = FAT32 (4 GB limit!). Copy existing 200 MB of PDFs to Desktop temporarily -> Format USB as **exFAT** -> move PDFs + 6 GB video back cleanly (works on both Windows & Mac!).',
          'Linux script: `ls -l deploy.sh` shows `-rw-r--r--` (`644`—missing execute `x` bit). Run `chmod 755 deploy.sh` -> becomes `-rwxr-xr-x` and executes cleanly.',
        ],
        outcome: 'Clean file transfers across OS boundaries and properly permissioned Linux tooling.',
      },
    },

    supportWalkthrough: {
      intro: 'Never grant folder permissions directly to individual names—always assign via clean groups.',
      steps: [
        {
          phase: 'Access Denied vs Path Not Found',
          action: 'Read the exact Windows popup wording: "Access is denied" (permissions/Deny) vs "Network path was not found" (DNS/SMB/offline/typo).',
          whyItWorks: 'Saves 15 minutes checking permissions when the actual fault is a typo or disconnected VPN.',
        },
      ],
      questionsToAsk: [
        '"Does the exact popup say Access Denied, Path Not Found, File in Use, or File Too Large?"',
        '"Did you sign out and back in yet since we added your account to the Finance folder group?"',
      ],
      sampleUserWording: [
        {
          situation: 'Explaining why formatting a USB stick requires copying files off first',
          sayThis:
            '"Your USB drive uses the older FAT32 format that blocks any single file over 4 GB. Let’s copy what’s already on the stick to your Desktop first—because converting it to exFAT will erase the stick—then move everything back safely."',
        },
      ],
      ticketNoteTemplate: {
        category: 'File Services -> USB Format / Folder Access',
        priorityFormula: 'Impact: Low (1 user) × Urgency: Medium = P3 Medium',
        internalNotes: `[SYMPTOM] Unable to copy 6.2 GB video onto 64 GB USB drive ("File too large").
[CAUSE] USB formatted FAT32 (4 GB single-file limit).
[ACTION] Temporarily backed up existing files to local folder, reformatted USB to exFAT (cross-platform Windows/macOS), verified 6.2 GB file copied cleanly.`,
        customerReply:
          'Hi Sam — Your USB drive was using an older format (FAT32) that caps individual files at 4 GB. After backing up your existing documents, we formatted it to exFAT so your 6.2 GB video copied right over and still opens on both Windows and Mac.',
        escalationCriteria:
          'Escalate server-side SMB ACL inheritance locks or missing volume snapshots to L2 Systems Administrators.',
      },
    },

    commonTraps: [
      {
        trap: 'Formatting a user’s USB stick from FAT32 to exFAT before backing up files sitting on it.',
        reality:
          'Formatting erases everything on the drive! Always copy existing USB contents off safely first.',
      },
      {
        trap: 'Setting Share Permissions to Read-Only while wondering why NTFS Modify users still cannot save files.',
        reality:
          'Remember: Share permissions and NTFS permissions intersect—the stricter one wins. Standard practice sets Share to Authenticated Users = Change/Full and enforces real limits inside NTFS Security!',
      },
    ],

    keyTerms: [
      {
        term: 'FAT32 vs. exFAT vs. NTFS',
        shortDef: 'Old 4 GB max file format (FAT32), cross-OS >4 GB flash format (exFAT), Windows default ACL format (NTFS).',
        fullDef:
          'Pair with **APFS** (modern Mac) and **ext4** (standard Linux).',
      },
      {
        term: '`AppData` (Hidden Profile Folder)',
        shortDef: 'Hidden folder inside `C:\\Users\\<name>\\AppData` storing app configs, caches, and Outlook OST files.',
        fullDef:
          'Critical location when clearing corrupt Teams/browser caches or migrating user data.',
      },
      {
        term: 'Linux `chmod` (755 / 644) & `chown`',
        shortDef: 'Set POSIX Read(4)/Write(2)/Execute(1) bits (`chmod`) and change file owner/group (`chown`).',
        fullDef:
          '`755` = Owner rwx, Group/Others r-x (scripts/folders); `644` = Owner rw-, Group/Others r-- (regular files).',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-351-q1',
        prompt: 'A user tries copying a single 5.5 GB presentation file onto a flash drive with 45 GB free space and sees "The file is too large for the destination file system." What is the cause?',
        options: [
          'The USB drive is formatted as FAT32, which caps individual file sizes at 4 GB; back up the USB and format to exFAT (or NTFS).',
          'USB 2.0 cannot transfer files above 4 GB.',
          'Windows blocks files larger than 4 GB on all removable media.',
          'The flash drive has a blown motherboard capacitor.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: FAT32’s 4 GB single-file ceiling triggers this exact message regardless of total free gigabytes.',
          'Incorrect: Port speed only affects transfer duration, not file-size limits.',
          'Incorrect: exFAT and NTFS support huge files smoothly.',
          'Incorrect: Flash drives have no motherboard capacitors.',
        ],
        takeaway: 'FAT32 = 4 GB max file limit; back up first, then format to exFAT for cross-OS large files.',
      },
      {
        id: 'itsup-351-q2',
        prompt: 'A network folder grants the Finance group **Modify** on NTFS Security, yet **Read** on SMB Share Permissions. What can a Finance member do over `\\\\files01\\Finance`?',
        options: [
          'Read files only—when Share and NTFS permissions combine over the network, the stricter permission wins.',
          'Modify and delete all files because NTFS always overrides Share.',
          'Take full ownership because both permissions add together.',
          'Nothing—combining Read and Modify results in Full Deny.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Remote users must satisfy BOTH gates; Read ∩ Modify = Read only.',
          'Incorrect: Neither overrides—the most restrictive wins.',
          'Incorrect: They intersect rather than add.',
          'Incorrect: Only an explicit Deny blocks Read.',
        ],
        takeaway: 'Share + NTFS intersection = strictest wins; explicit Deny overrides Allow.',
      },
      {
        id: 'itsup-351-q3',
        prompt: 'What does running `chmod 755 backup.sh` configure on a Linux file?',
        options: [
          'Owner gets Read+Write+Execute (7), while Group and Others get Read+Execute (5).',
          'Everyone gets full delete permission (777).',
          'Only Owner gets Read-Only (400).',
          'Moves the file to `/Users/755`.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `r=4, w=2, x=1` -> `4+2+1=7` (`rwx`), `4+0+1=5` (`r-x`).',
          'Incorrect: Full world-writeable would be `777` (avoid!).',
          'Incorrect: `400` would deny execute and group/other access.',
          'Incorrect: `chmod` modifies permissions, not file location (`mv`).',
        ],
        takeaway: '`chmod 755` = `rwxr-xr-x`; `chmod 644` = `rw-r--r--`; `chown` swaps owner.',
      },
      {
        id: 'itsup-351-q4',
        prompt: 'Where does Windows store hidden per-user application caches (like browser/Teams profiles) inside a user’s profile?',
        options: [
          '`C:\\Users\\<username>\\AppData` (hidden by default).',
          '`C:\\Program Files\\PublicCache`',
          '`/var/log/appdata`',
          '`D:\\System32\\Temp`',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `AppData` (`Local`, `LocalLow`, `Roaming`) holds per-user app settings and caches.',
          'Incorrect: Program Files stores shared application binaries, not personal caches.',
          'Incorrect: Linux log path.',
          'Incorrect: Fabricated path.',
        ],
        takeaway: 'Windows profiles live in `C:\\Users\\...` (with hidden `AppData`); Mac uses `/Users`; Linux uses `/home`.',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Solve Share vs NTFS Access Denied & Map a Drive',
      targetTab: 'simulator',
      instructions: [
        'Run INC-2029 inside the Service Desk Simulator to practice Share vs NTFS permission triage and `net use` verification.',
        'Check your own `C:\\Users\\<you>\\AppData` path (or `/home`/`/Users`) and practice calculating `chmod` numeric values (`755`, `644`, `700`).',
      ],
      verificationCheck: '4/4 score on INC-2029 and accurate numeric translation for any `rwx` permission string.',
    },

    summaryBullets: [
      'Recognize NTFS (Windows default), FAT32 (4 GB max file cap!), exFAT (cross-OS large drives), APFS (macOS), and ext4 (Linux).',
      'User profiles live in `C:\\Users` (including hidden `AppData`), `/Users` (macOS), and `/home` (Linux).',
      'When accessing network shares (`net use`), Share permissions and NTFS Security intersect—the stricter rule wins, and Deny overrides Allow.',
      'Grant NTFS permissions to security groups, never individuals, and verify group changes after sign-out/sign-in.',
      'Decode Linux `rwx` weights (`r=4, w=2, x=1`): `755` for scripts/folders, `644` for files, `chown` for ownership.',
    ],

    sourcesToVerify: [
      'Microsoft Learn — File Systems (NTFS, FAT32, exFAT) & Share vs NTFS Permissions',
      'Linux Manual Pages — chmod(1) & chown(1)',
    ],
  },

  'itsup.3.6.1': {
    id: 'itsup.3.6.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 3: Operating Systems',
    topicTitle: '3.6 Installing, Updating and Imaging',
    code: '3.6.1',
    title: 'App Installers (.exe/.msi/.msix/winget/.pkg), UAC & Standard Users, Patch Tuesday, Update Repair, Autopilot & Reset',
    readMinutes: 12,
    prerequisites: ['3.2.1', '3.5.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Identify standard installer formats across Windows (`.exe`, `.msi`, `.msix`, Microsoft Store, `winget`), macOS (`.pkg`, App Store), and Linux (`apt`/`dnf`) while checking licensing first.',
      'Explain why employees work under Standard accounts with User Account Control (UAC) enforcing least privilege.',
      'Differentiate Windows Quality Updates (monthly Patch Tuesday on the 2nd Tuesday) from Feature Updates and execute the exact repair workflow when Windows Update breaks.',
      'Compare traditional Golden Image deployment vs. modern cloud provisioning (Windows Autopilot) alongside Reset this PC, recovery USBs, Restore Points, and pre-reset user backups.',
    ],

    whyThisMatters: {
      scenarioTitle: '"Update Stuck at 42%—and a User Wants Admin Rights to Install Freeware"',
      narrative:
        'A finance associate hits a Windows **UAC** password prompt trying to install an unapproved PDF converter, while three laptops stall endlessly on this month’s **Patch Tuesday** security update. Knowing when to say "no" kindly on standard accounts, how to run `DISM` + `sfc /scannow` + Windows Update service resets, and when to trigger **Reset this PC** vs. **Autopilot** keeps devices secure and recoverable.',
    },

    plainEnglish: {
      analogyTitle: 'A Security Guard at the Storefront vs. Factory-New Cloud Blueprints',
      analogy:
        'Working with a **Standard user account** plus **UAC** is like driving with seatbelts: you can steer anywhere for normal work, yet if something asks to swap the engine (**install system software**), a prompt stops and asks an authorized mechanic (**admin check**) first! Meanwhile, older IT built laptops by stamping a bulky photocopy (**Golden Image**); modern **Windows Autopilot** ships a sealed factory laptop straight to a remote employee’s porch and automatically configures company apps over Wi-Fi on first sign-in.',
      technicalDefinition:
        'Endpoint software lifecycle combines verified packaging (`.msi`/`.msix`/`winget`), UAC privilege separation, Patch Tuesday quality cadence vs. feature upgrades, automated corruption repair (`DISM` + `sfc`), and provisioning models (golden images, cloud Autopilot, WinRE recovery media).',
      paragraphs: [
        'Always check **licensing and IT approval** before installing anything! Know the extensions: Windows uses **`.exe`** (executable setup), **`.msi`** (Microsoft Installer—great for silent remote deployment), **`.msix`**, Microsoft Store, and command-line **`winget`**; macOS uses **`.pkg`** or Mac App Store; Linux uses **`apt`/`dnf`**.',
        '**Patch Tuesday**: Microsoft releases monthly cumulative security & bug fixes (**Quality Updates**) on the **second Tuesday of every month**, plus larger annual/semi-annual **Feature Updates** adding new OS versions. Schedule restarts thoughtfully so users never lose unsaved work mid-meeting.',
        'Before any Windows **Reset this PC** or reimage, **back up user files first** (`Desktop`, `Documents`, local profiles)! Keep a **Windows Recovery USB** handy in your desk kit for machines that refuse to start at all.',
      ],
    },

    deepDive: {
      intro: 'Follow the exact Patch Tuesday / Failed Update repair sequence and modern provisioning paths.',
      steps: [
        {
          step: '01',
          title: 'Failed Windows Update Repair Ladder (Interview Question!)',
          explanation:
            'When an update repeatedly fails: (1) Check **free disk space** (updates need 15–25 GB free!), (2) **Restart** cleanly (remember Fast Startup!), (3) Run **`DISM /Online /Cleanup-Image /RestoreHealth`** then **`sfc /scannow`** in elevated CMD, (4) Restart the **Windows Update (`wuauserv`)** service (clearing `SoftwareDistribution` cache if needed), (5) If a specific new patch broke things, **uninstall that problem update** cleanly—and check driver/firmware updates separately.',
        },
        {
          step: '02',
          title: 'Standard Accounts & UAC Protection',
          explanation:
            'Day-to-day users run as Standard Users—if they accidentally double-click malware, it lacks system-wide install rights! **UAC (User Account Control)** prompts explicitly before any admin-level change runs.',
        },
        {
          step: '03',
          title: 'Golden Images vs. Windows Autopilot',
          explanation:
            'A **Golden Image** captures one pre-configured OS + core apps onto a master image cloned onto PCs locally (goes stale quickly!). **Windows Autopilot** links a device’s hardware ID to cloud device management (covered in Unit 6 with Intune) so a fresh laptop pulls settings and apps automatically over the internet when the user signs in.',
        },
        {
          step: '04',
          title: 'Reset This PC, Restore Points & Recovery USB',
          explanation:
            '**Restore Points** undo bad driver/Registry edits cleanly; **Reset this PC** offers "Keep my files" vs "Remove everything"; a **bootable USB installation/recovery drive** saves machines whose built-in recovery partition is unreadable.',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'Failed Windows Update Fix Ladder',
        asciiFallback: `[Update Fails] -> [1. Free Disk Space >= 20GB?] -> [2. Real Restart]
       |
       v
[3. Elevated CMD: DISM /RestoreHealth -> sfc /scannow]
       |
       v
[4. Restart Windows Update Service / Uninstall Bad KB] -> [Last Resort: Backup -> Reset / Reimage]`,
      },
      workedExample: {
        title: 'Fixing an Uncooperative Security Update Without Wiping',
        context: 'Interview question: "A Windows Update keeps failing at 78% with error 0x800f0922 on a user’s laptop. What do you do?"',
        steps: [
          'Confirm C: drive has >20 GB free disk space (many update failures occur simply at 3 GB free!).',
          'Run full Restart (not Shut down), temporarily pause third-party VPN if blocking Microsoft update endpoints.',
          'Open elevated terminal -> run `DISM /Online /Cleanup-Image /RestoreHealth` to fix the Windows component store, followed by `sfc /scannow` to repair protected system files.',
          'Restart `wuauserv` service in `services.msc`, re-run Windows Update -> update hits 100% and installs cleanly.',
        ],
        outcome: 'Fixed in one remote session with zero reimaging.',
      },
    },

    supportWalkthrough: {
      intro: 'Never approve random software installs or bypass UAC without checking software licensing first.',
      steps: [
        {
          phase: 'DISM Before SFC',
          action: 'Run `DISM /Online /Cleanup-Image /RestoreHealth` first, then `sfc /scannow`.',
          whyItWorks: '`sfc` relies on the local component store; `DISM` repairs that store first so `sfc` actually succeeds.',
        },
        {
          phase: 'Schedule Reboots Kindly',
          action: 'Ask when the user finishes meetings before triggering an update reboot.',
          whyItWorks: 'Prevents wiping out 45 minutes of unsaved spreadsheet work.',
        },
      ],
      questionsToAsk: [
        '"How much free space shows on your C: drive right now under File Explorer -> This PC?"',
        '"Is this software listed in our approved software catalog, or is it a new request needing manager & license sign-off?"',
      ],
      sampleUserWording: [
        {
          situation: 'Explaining why users don’t get local admin rights politely',
          sayThis:
            '"Keeping everyday accounts standard means that even if a sneaky link tries installing something harmful in the background, UAC stops it cold. I’ll verify this app is licensed and install it safely for you right now!"',
        },
      ],
      ticketNoteTemplate: {
        category: 'Operating Systems -> Windows Update Failure',
        priorityFormula: 'Impact: Low (1 PC) × Urgency: Medium = P3 Medium',
        internalNotes: `[SYMPTOM] Monthly Patch Tuesday quality update repeatedly rolled back at 78% (error 0x800f0922).
[CHECKS] Confirmed 34 GB free on C:. Ran DISM /Online /Cleanup-Image /RestoreHealth (repaired store) -> sfc /scannow (repaired corrupted system files) -> restarted wuauserv.
[RESULT] Update installed cleanly after scheduled lunch restart; winver shows current build.`,
        customerReply:
          'Hi Jordan — Repairing Windows’ underlying update store cleared the stall, and your latest security update finished cleanly over lunch. You’re all set!',
        escalationCriteria:
          'Escalate if error persists across multiple fleet machines (indicates bad Microsoft patch needing WSUS/Intune pause -> Unit 6/10).',
      },
    },

    commonTraps: [
      {
        trap: 'Handing permanent local administrator rights to regular employees so they stop opening install tickets.',
        reality:
          'Permanent local admin rights let ransomware and unapproved software infect the whole PC silently—use approved catalogs, `winget`/MDM push, or temporary UAC elevation.',
      },
      {
        trap: 'Running `Reset this PC` -> "Remove everything" before checking Desktop/Downloads/sticky notes/PST files.',
        reality:
          'Always verify cloud sync status AND copy local folders cleanly before resetting or swapping a laptop.',
      },
    ],

    keyTerms: [
      {
        term: 'UAC (User Account Control)',
        shortDef: 'Windows prompt requesting confirmation/admin credentials before system-wide changes run.',
        fullDef:
          'Enforces least privilege so background programs cannot silently alter OS files or install drivers.',
      },
      {
        term: 'Patch Tuesday',
        shortDef: 'Second Tuesday of every month when Microsoft ships routine security Quality Updates.',
        fullDef:
          'Distinguished from annual Feature Updates that introduce broader OS version bumps.',
      },
      {
        term: 'sfc /scannow & DISM',
        shortDef: 'Windows repair pair: DISM heals the system component store; `sfc` repairs protected OS files.',
        fullDef:
          'Run `DISM /Online /Cleanup-Image /RestoreHealth` first, then `sfc /scannow` in an elevated prompt.',
      },
      {
        term: 'Golden Image vs. Autopilot',
        shortDef: 'Pre-cloned OS snapshot (Golden Image) vs. cloud zero-touch self-provisioning (Autopilot).',
        fullDef:
          'Autopilot lets vendors ship factory-sealed laptops straight to remote staff for automatic setup at sign-in.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-361-q1',
        prompt: 'What does running `DISM /Online /Cleanup-Image /RestoreHealth` followed by `sfc /scannow` accomplish?',
        options: [
          'DISM repairs the Windows component store, enabling `sfc /scannow` to verify and restore corrupted protected OS files.',
          'Deletes all personal documents and formats C:.',
          'Upgrades Windows 10 Home to Windows 11 Enterprise automatically.',
          'Flushes DNS and resets Wi-Fi passwords.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: This classic pair fixes corrupt OS files that break Windows Updates and built-in tools.',
          'Incorrect: Both commands preserve personal data completely.',
          'Incorrect: Neither modifies OS licensing.',
          'Incorrect: Unrelated to networking.',
        ],
        takeaway: 'Run `DISM /Online /Cleanup-Image /RestoreHealth` then `sfc /scannow` when OS files or updates break.',
      },
      {
        id: 'itsup-361-q2',
        prompt: 'What is "Patch Tuesday" in enterprise IT support?',
        options: [
          'The second Tuesday of every month when Microsoft releases routine cumulative security Quality Updates.',
          'The day every workstation gets physically wiped and reimaged.',
          'An internal rule banning Tuesday password resets.',
          'A Linux kernel-only holiday.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Service desks prepare for Wednesday/Thursday ticket spikes right after monthly Patch Tuesday rollouts.',
          'Incorrect: Patches update existing OS installations without wiping.',
          'Incorrect: Password resets work normally.',
          'Incorrect: Refers specifically to Microsoft’s monthly update cadence.',
        ],
        takeaway: 'Patch Tuesday = 2nd Tuesday monthly security updates; watch update queues right afterward!',
      },
      {
        id: 'itsup-361-q3',
        prompt: 'Why is an `.msi` installer often preferred over a consumer `.exe` in enterprise software deployment?',
        options: [
          '`.msi` packages follow standardized Windows Installer parameters for silent, repeatable fleet deployment and clean uninstalls.',
          '`.msi` files bypass all software licensing fees legally.',
          '`.exe` files only run on macOS.',
          '`.msi` files work on iPhones.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: `.msi` (and modern `.msix` / `winget`) integrates cleanly with MDM/packaging tools.',
          'Incorrect: Licensing compliance still applies identically.',
          'Incorrect: macOS uses `.pkg` / `.dmg` / App Store.',
          'Incorrect: iOS uses App Store / `.ipa` MDM packages.',
        ],
        takeaway: 'Know OS package worlds: `.exe`/`.msi`/`.msix`/`winget` (Win), `.pkg` (Mac), `apt`/`dnf` (Linux).',
      },
      {
        id: 'itsup-361-q4',
        prompt: 'How does Windows Autopilot simplify deploying laptops to new remote staff compared to traditional Golden Images?',
        options: [
          'A factory-sealed laptop ships directly to the user and pulls company apps, policies, and encryption automatically from the cloud on first sign-in.',
          'Every new employee drives to headquarters to hand-install Windows from a DVD.',
          'Autopilot installs software onto unmanaged personal phones without consent.',
          'Golden Images run exclusively in web browsers.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Zero-touch provisioning avoids maintaining massive static disk clones in the IT closet.',
          'Incorrect: Eliminates shipping back through IT closets for cloning.',
          'Incorrect: Autopilot provisions registered Windows corporate hardware.',
          'Incorrect: Golden Images are full OS disk images.',
        ],
        takeaway: 'Autopilot provisions new Windows PCs straight from the cloud without manual bench cloning.',
      },
    ],

    handsOnActivity: {
      kind: 'exercise',
      title: 'Practice `winget`, `sfc` / `DISM` & Recovery Options in a VM',
      instructions: [
        'In a practice Windows VM (or read-only terminal), inspect `winget search` (if available) and verify how Startup Repair, Restore Points, and Reset this PC work inside Settings -> Recovery.',
      ],
      verificationCheck: 'Can state all 5 failed-Windows-Update steps in exact logical sequence.',
    },

    summaryBullets: [
      'Recognize Windows (`.exe`/`.msi`/`.msix`/`winget`), macOS (`.pkg`/App Store), and Linux (`apt`/`dnf`) packages—always verify licensing first.',
      'Standard user accounts + UAC prevent silent malware installs and accidental OS damage.',
      'Monthly security patches arrive on Patch Tuesday (2nd Tuesday); Feature Updates deliver major builds.',
      'Fix stuck Windows Updates sequentially: check free space -> restart -> DISM + sfc -> restart `wuauserv` -> uninstall bad update.',
      'Back up user data first before any Reset this PC, recovery USB repair, or Autopilot/Golden Image reprovisioning.',
    ],

    sourcesToVerify: [
      'Microsoft Learn — Windows Update Troubleshooting (DISM & SFC) & Windows Autopilot',
      'CompTIA A+ Core 2 (220-1102) — OS Installation, Patching & Recovery',
    ],
  },

  'itsup.3.7.1': {
    id: 'itsup.3.7.1',
    moduleId: 'it-support',
    unitTitle: 'Unit 3: Operating Systems',
    topicTitle: '3.7 OS Performance & Damaged Profiles',
    code: '3.7.1',
    title: 'Slow PC Method, App Freeze Isolation, BSOD Stop Codes & Proving a Damaged Windows User Profile',
    readMinutes: 11,
    prerequisites: ['3.2.1', '3.6.1'],
    versionScope: 'shared',

    learningObjectives: [
      'Execute the methodical "PC is running slow" checklist across Task Manager, startup apps, free disk space, malware, syncing, thermals, and failing drives.',
      'Isolate single-user profile corruption cleanly by testing sign-in with a second/test user account.',
      'Investigate BSOD stop codes using Event Viewer, recent changes, RAM/disk diagnostics, and Safe Mode driver rollback.',
      'Apply the four key scope-narrowing questions before troubleshooting any OS glitch.',
    ],

    whyThisMatters: {
      scenarioTitle: '"My Laptop Crawls and Excel Crashes Only for Me—Wait, It Works for Sarah!"',
      narrative:
        'A recruiter complains their laptop takes 8 minutes to open Outlook and crashes every spreadsheet—yet when a coworker logs into that exact same laptop using their own account, everything snaps open in two seconds! Beginners wipe the whole PC or replace the SSD blindly. Knowing how to test a **second user profile** proves profile corruption vs. system-wide OS/hardware decay immediately.',
    },

    plainEnglish: {
      analogyTitle: 'A Messy Personal Locker Inside an Otherwise Clean Gym',
      analogy:
        'If every locker room shower breaks, the building plumbing is broken (**system-wide OS or hardware**). Yet if John’s locker won’t open while Sarah’s locker right next to it works cleanly, you don’t demolish the gym—you replace John’s jammed locker door (**rebuild the damaged user profile**)!',
      technicalDefinition:
        'OS symptom isolation distinguishes system-wide resource bottlenecks (CPU/RAM/Disk/Thermal/Malware) and driver/kernel panics (BSOD stop codes) from per-user Windows registry hive (`NTUSER.DAT`) or `AppData` profile corruption via secondary account testing.',
      paragraphs: [
        'Start every OS fault with **four scope questions**: (1) *One app or the whole machine?* (2) *One user or everyone on that PC?* (3) *What changed recently?* (4) *Can you reproduce it right now while I watch?*',
        'When interviewing on **"A PC is slow—what is your process?"**, never blurt *"I run CCleaner."* Show method: confirm scope + recent changes -> check **Task Manager** (CPU, Memory, 100% Disk, Startup bloat) -> check **free C: disk space** (SSDs choke when <10% free!) -> check background updates/OneDrive sync + malware scan -> check **thermal throttling / failing S.M.A.R.T. drive**.',
        'For **Blue Screens (BSOD)**: capture the exact **stop code** (e.g., `INACCESSIBLE_BOOT_DEVICE`, `CRITICAL_PROCESS_DIED`, `MEMORY_MANAGEMENT`), inspect Event Viewer/Reliability Monitor around that exact minute, ask what driver/update/USB gadget changed, and test **Safe Mode rollback**.',
      ],
    },

    deepDive: {
      intro: 'Work through slowness, app freezes, BSODs, and damaged profiles systematically.',
      steps: [
        {
          step: '01',
          title: 'Slow PC Method (8-Point Check)',
          explanation:
            '1) Uptime (needs real Restart?); 2) Task Manager CPU/RAM/Disk percentages; 3) Startup Apps (disable heavy bloat); 4) Free disk space (>15% free on C:); 5) Background Windows Update or giant OneDrive sync running; 6) Malware scan; 7) Overheating fans/blocked vents; 8) Old HDD or low 8 GB RAM needing hardware upgrade.',
        },
        {
          step: '02',
          title: 'App Crashes & Freezes',
          explanation:
            'Check Reliability Monitor / Event Viewer Application log for exact "Faulting module" name (often an add-in `.dll`). Update/Repair app (`appwiz.cpl` -> Change/Repair), test elevated once if permissions suspected, and test on a second user profile.',
        },
        {
          step: '03',
          title: 'Damaged User Profile Proof',
          explanation:
            'Symptom: Start menu breaks, settings won’t save, or apps crash ONLY for User A on that PC. Test: sign out and sign in with **User B (a clean test account)**. If User B works smoothly, the hardware and Windows OS are 100% healthy—only User A’s local profile is damaged! Back up User A’s files and recreate their local profile.',
        },
        {
          step: '04',
          title: 'BSOD Stop Codes & Safe Mode Recovery',
          explanation:
            'Record stop code (`IRQL_NOT_LESS_OR_EQUAL`, `VIDEO_TDR_FAILURE`, etc.) + Event ID 41 / BugCheck event. Ask "What changed?" -> Boot Safe Mode -> roll back the suspect driver or uninstall yesterday’s update -> test RAM (`mdsched.exe`) and disk (`chkdsk` / S.M.A.R.T.).',
        },
      ],
      diagram: {
        kind: 'ascii',
        caption: 'One-App vs Whole-PC vs One-Profile Diagnostic Branch',
        asciiFallback: `[OS Trouble] -> [Fails for Test User #2 too?]
                   |--- YES (System-wide!) ---> Task Mgr / Disk Space / BSOD Driver / Hardware
                   |--- NO (Works for User #2!) ---> Damaged User Profile! (Backup & Rebuild Profile)`,
      },
      workedExample: {
        title: 'Isolating a Broken Start Menu & Constant Excel Crash in 4 Minutes',
        context: 'User says their Windows Start menu stopped opening and apps stall right after a forced power outage during sign-in.',
        steps: [
          'Check Reliability Monitor -> sees multiple shell crashes under user account since yesterday’s sudden battery loss.',
          'Test sign-in with local/IT test account on the same machine -> Start menu opens instantly, Excel opens cleanly.',
          'Proved damaged profile! Back up user’s `Desktop`, `Documents`, `Downloads`, browser bookmarks -> rename/remove corrupt profile folder cleanly via Advanced System Settings -> have user sign in fresh -> restore files.',
        ],
        outcome: 'Saved hours of useless Windows reinstallation and preserved every personal file.',
      },
    },

    supportWalkthrough: {
      intro: 'Pair scope questions with Reliability Monitor before prescribing any drastic reset.',
      steps: [
        {
          phase: 'Capture Exact BSOD Code',
          action: 'Ask user to snap a quick phone photo of any Blue Screen stop code before it auto-reboots.',
          whyItWorks: 'The bottom stop code (`DRIVER_POWER_STATE_FAILURE`) names the subsystem immediately.',
        },
      ],
      questionsToAsk: [
        '"Is just one program freezing, or is the whole laptop sluggish even right after a Restart?"',
        '"How long has it been since your last full Restart—and how much space is left on C:?"',
        '"What changed right before the first Blue Screen—an update, new dock, or software install?"',
      ],
      sampleUserWording: [
        {
          situation: 'Explaining a profile rebuild safely',
          sayThis:
            '"When we tested a fresh test account on your laptop, everything flew—which proves your laptop hardware and Windows itself are healthy! Only your personal Windows profile folder got scrambled during yesterday’s crash, so we’ll back up your files and let Windows build a clean profile for you."',
        },
      ],
      ticketNoteTemplate: {
        category: 'Operating Systems -> Profile Corruption / Slow Performance',
        priorityFormula: 'Impact: Low (1 user) × Urgency: Medium = P3 Medium',
        internalNotes: `[SYMPTOM] Start menu dead, explorer crashes, extreme slowness on user sign-in.
[ISOLATION] C: drive has 85 GB free; S.M.A.R.T. healthy; local test account signed in and ran smoothly (ruled out OS/hardware fault).
[RESOLUTION] Backed up C:\\Users\\jdoe personal folders, rebuilt local user profile cleanly, restored Desktop/Documents/Favorites, verified clean login & Start menu.`,
        customerReply:
          'Hi Jordan — Testing a clean account proved your laptop’s hardware was fine and isolated the glitch to a corrupted user profile. We backed up your files, refreshed your profile, and verified everything opens smoothly again!',
        escalationCriteria:
          'Escalate recurring multi-machine BSODs after an identical patch to L2/Problem Management immediately.',
      },
    },

    commonTraps: [
      {
        trap: 'Deleting a damaged user profile folder manually from `C:\\Users` without backing up first or removing its Registry `ProfileList` key.',
        reality:
          'Manually deleting `C:\\Users\\name` leaves orphaned Registry keys causing "We can’t sign into your account (Temporary Profile)" loops! Always back up first and remove via System Properties -> User Profiles.',
      },
      {
        trap: 'Ignoring 98%-full SSDs as a cause of extreme Windows lag.',
        reality:
          'Solid-state drives slow down dramatically and break Windows pagefile/update caching when <5–10% free space remains.',
      },
    ],

    keyTerms: [
      {
        term: 'BSOD (Blue Screen of Death) Stop Code',
        shortDef: 'Critical kernel crash code (like `CRITICAL_PROCESS_DIED`) written when Windows halts safely.',
        fullDef:
          'Paired with Reliability Monitor / Event Viewer timestamps to pinpoint faulty drivers or failing RAM/storage.',
      },
      {
        term: 'Damaged User Profile',
        shortDef: 'Per-user settings/registry hive (`NTUSER.DAT`) corruption isolated cleanly by testing a second account.',
        fullDef:
          'Rebuilding only the corrupt profile avoids wiping shared apps or the whole OS.',
      },
    ],

    checkQuestions: [
      {
        id: 'itsup-371-q1',
        prompt: 'An employee’s Start menu won’t open and apps crash immediately after sign-in. When a coworker signs into that same laptop, everything works cleanly. What is proven?',
        options: [
          'The hardware and OS are healthy; the first employee’s Windows user profile is damaged and needs backup + profile rebuild.',
          'The laptop CPU is overheating.',
          'The office router dropped DHCP.',
          'The coworker has faster RAM assigned.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Working cleanly for a second user proves a per-profile fault rather than hardware or whole-OS corruption.',
          'Incorrect: Thermal throttling affects every user equally.',
          'Incorrect: Network routers do not break Start menu launches.',
          'Incorrect: RAM is shared hardware.',
        ],
        takeaway: 'Test with a second user account whenever weird crashes follow only one user on a PC.',
      },
      {
        id: 'itsup-371-q2',
        prompt: 'In an interview: "A PC is running slowly. What is your process?" What separates a strong answer from a weak guess?',
        options: [
          'Follow a method: clarify scope & recent changes -> check Task Manager (CPU/RAM/Disk/Startup) -> check free C: space & uptime -> check malware/updates/temps -> recommend fix.',
          'Say "I immediately buy a new SSD and wipe the laptop."',
          'Say "I tell the user all laptops are slow."',
          'Say "I restart the print spooler."',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Interviewers watch structured narrowing—scope, resources, recent changes, then root fix.',
          'Incorrect: Skips zero-cost Task Manager/disk checks.',
          'Incorrect: Dismissive and useless.',
          'Incorrect: Print spooler rarely freezes an entire PC.',
        ],
        takeaway: 'Structure "slow PC" answers: Scope -> Changes -> Task Manager -> Disk Space -> Updates/Malware/Temps.',
      },
      {
        id: 'itsup-371-q3',
        prompt: 'A PC hits a Blue Screen (`DRIVER_IRQL_NOT_LESS_OR_EQUAL`) right after a video driver update. Which step fixes it cleanest?',
        options: [
          'Note the stop code, boot into Safe Mode, and roll back the recently updated video driver in Device Manager.',
          'Delete `C:\\Windows\\System32`.',
          'Turn off the office Wi-Fi router.',
          'Ignore it because stop codes clear permanently on their own.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Safe Mode loads basic generic graphics so you can cleanly roll back yesterday’s bad driver.',
          'Incorrect: Destroys Windows immediately.',
          'Incorrect: Unrelated to local driver kernel crashes.',
          'Incorrect: Repeat BSODs cause data corruption if left unfixed.',
        ],
        takeaway: 'BSOD after update/driver -> record stop code -> Safe Mode -> roll back driver/update.',
      },
      {
        id: 'itsup-371-q4',
        prompt: 'Why does having only 1 GB free on a 256 GB Windows C: SSD make the whole laptop feel broken?',
        options: [
          'Windows runs out of space for virtual memory paging, temp caches, browser profiles, and update staging, causing severe lag and app crashes.',
          'Windows lowers the CPU clock to 1 MHz deliberately.',
          'Full disks turn off Ethernet ports.',
          'SSDs delete the mouse cursor driver.',
        ],
        correctIndex: 0,
        optionExplanations: [
          'Correct: Every app and OS subsystem needs breathing room (aim >=10–15% free space) to operate cleanly.',
          'Incorrect: Not a deliberate CPU throttle.',
          'Incorrect: NIC stays powered.',
          'Incorrect: Mouse drivers remain intact.',
        ],
        takeaway: 'Always check free C: disk space early on slow or crashing PCs!',
      },
    ],

    handsOnActivity: {
      kind: 'ticket-sim',
      title: 'Investigate Multi-PC BSODs & Slow VM Troubleshooting',
      targetTab: 'simulator',
      instructions: [
        'Run INC-4090 inside the Service Desk Simulator to correlate BSOD stop codes across six fleet laptops and practice Problem escalation.',
        'In a test VM, practice checking Task Manager -> Startup Apps, Reliability Monitor, and creating/testing a secondary standard local user profile.',
      ],
      verificationCheck: '4/4 score on INC-4090 plus clean mental checklist for Slow PC & Profile isolation.',
    },

    summaryBullets: [
      'Start every OS fault with 4 questions: one app or whole PC? one user or many? what changed? reproducible?',
      'Troubleshoot slow PCs cleanly: Uptime/Restart -> Task Manager (CPU/RAM/Disk/Startup) -> Free C: space -> Malware/Updates/Thermals.',
      'Prove damaged user profiles cleanly by testing a second account on the same computer—rebuild profile after backing up files.',
      'Diagnose BSODs via exact stop codes, Event Viewer/Reliability timestamps, Safe Mode driver/update rollback, and memory/disk checks.',
      'Never delete a broken profile folder manually without backing up data and removing the profile entry cleanly.',
    ],

    sourcesToVerify: [
      'Microsoft Learn — Windows Stop Code Troubleshooting & Fix a Corrupted User Profile',
      'CompTIA A+ Core 2 (220-1102) — Troubleshooting Common OS Symptoms',
    ],
  },
};
