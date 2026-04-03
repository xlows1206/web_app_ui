"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'en' | 'zh';

type Translations = {
  nav: { brand: string; adminName: string };
  invite: {
    button: string;
    title: string;
    subtitle: string;
    rewardLabel: string;
    rewardValue: string;
    copyLink: string;
    copied: string;
    linkTitle: string;
  };
  sidebar: {
    home: string;
    projects: string;
    newChat: string;
    historySessions: string;
    noSessions: string;
    sendFirstObjective: string;
    recent: string;
    expand: string;
    collapse: string;
  };
  common: {
    back: string;
    cancel: string;
    confirm: string;
    save: string;
    delete: string;
    rename: string;
    preview: string;
    download: string;
    apply: string;
    view: string;
    more: string;
    add_to_context: string;
    noMatch: string;
    all: string;
    justNow: string;
    loading: string;
    aiRecognition: string;
    updatedAt: string;
    copied: string;
  };
  notifications: {
    title: string;
    empty: string;
    markAllRead: string;
    viewAll: string;
    time1: string;
    time2: string;
    types: {
      joined: string;
      removed: string;
      removedSuffix: string;
    };
    mockProject1: string;
    mockProject2: string;
  };
  menu: {
    editProfile: string;
    language: string;
    logout: string;
    version: string;
    zh: string;
    en: string;
    aiCredit: string;
    upgrade: string;
    projectSource: string;
    created: string;
  };
  templateCard: {
    apply: string;
    view: string;
    applyAndCreate: string;
  };
  templateModal: {
    title: string;
    apply: string;
    cancel: string;
    selectProjectTitle: string;
    selectProjectSubtitle: string;
  };
  projectMenu: {
    source: string;
    members: string;
    membersHint: string;
    rename: string;
    share: string;
    shareSuccess: string;
    duplicate: string;
    delete: string;
  };
  memberModal: {
    title: string;
    shareHint: string;
    copyLink: string;
    remove: string;
    joined: string;
    workspaceType: string;
  };
  deleteDocModal: {
    title: string;
    warning: string;
    inputPrompt: string;
    inputPlaceholder: string;
    confirmButton: string;
  };
  docTypeModal: {
    title: string;
    subtitle: string;
    simulation: string;
    piping: string;
    simulationDesc: string;
    pipingDesc: string;
    fromTemplate: string;
  };
  onboarding: {
    title: string;
    intro: string;
    featuresTitle: string;
    points: string[];
    templatesTitle: string;
    templatesDesc: string;
    templatesHint: string;
    templatesImageAlt: string;
    exploreTemplates: string;
    close: string;
  };
  templates: {
    title: string;
    subtitle: string;
    browse: string;
    new: string;
    allIndustries: string;
    countSuffix: string;
    items: { title: string; desc: string; longDesc: string; category: string; image?: string; isNew?: boolean }[];
  };
  projects: {
    title: string;
    subtitle: string;
    filter: string;
    add: string;
    searchPlaceholder: string;
    emptyHint: string;
    titlePlaceholder: string;
    updated: string;
    ago: string;
    daysAgo: string;
    noProjectSelected: string;
    backToHome: string;
    projectFiles: string;
    projectParams: string;
    noAttachments: string;
    uploadNew: string;
    assets: string;
    attachmentsTitle: string;
    simulationCases: { id: string; title: string; desc: string; img: string; prompt: string }[];
    pipingCases: { id: string; title: string; desc: string; img: string; prompt: string }[];
    parameters: string;
    parameterCategories: {
      Process: string;
      Equipment: string;
    };
    sandboxSubtitle: string;
    sandboxTitle: string;
    tags: {
      piping: string;
      simulation: string;
      pid: string;
      hazop: string;
    };
    items: { title: string; tags: string[] }[];
  };
  workDoc: {
    title: string;
    createButton: string;
    emptyState: string;
    noMatch: string;
    createdAt: string;
    updatedAt: string;
    defaultTitlePrefix: string;
    simulation: string;
    piping: string;
  };
    document: {
      noDocSelected: string;
      backToProject: string;
      workspaceBreadcrumb: string;
      newMessage: string;
      chat: string;
      connected: string;
      disconnected: string;
      interactive: string;
      aiAssistant: string;
      aiPlaceholder: string;
      send: string;
      simulationCanvasReady: string;
      simulationCanvasDesc: string;
      connectButton: string;
      toggleConnection: string;
      fullscreen: string;
      simulationEngineOffline: string;
      simulationEngineDesc: string;
      receivedMsg: string;
      analyzingMsg: string;
      agentOperating: string;
      needsIntervention: string;
      pfd: string;
      feeds: string;
      quickStart: string;
      tapToFill: string;
      stop: string;
      identifiedParams: string;
      viewDetail: string;
      expandLiveView: string;
      collapseLiveView: string;
      collapse: string;
      expand: string;
      aiRecognitionMsg: string;
      assistant: string;
      liveView: string;
      engineActive: string;
      engineOffline: string;
      engineActiveDesc: string;
      engineOfflineDesc: string;
      connectServer: string;
      welcomeBack: string;
      routingPrompt: string;
      routingPromptTitle: string;
      routingPromptBody: string;
      goToProjects: string;
      memoryUpdatedTitle: string;
      memoryUpdatedBody: string;
      memoryUpdatedAck: string;
      processedMsg: string;
      templateApplyPrompt: string;
      aiRecognition: string;
    tasks: {
      initializing: string;
      parsing: string;
      extracting: string;
      matching: string;
      checking: string;
      generating: string;
    };
    quickPrompts: { id: string; title: string; prompt: string }[];
  };
  fileUpload: {
    dropzoneActive: string;
    dropzoneInactive: string;
    supportAll: string;
  };
  configTable: {
    name: string;
    value: string;
    unit: string;
    actions: string;
    params: string;
    newParam: string;
    manual: string;
    noParam: string;
    addParam: string;
  };
  createProject: {
    title: string;
    nameLabel: string;
    namePlaceholder: string;
    tagsLabel: string;
    createButton: string;
  };
  newProjectModal: {
    title: string;
    subtitle: string;
    typeLabel: string;
    types: {
      simulation: { label: string; subLabel: string };
      piping: { label: string; subLabel: string };
      pid: { label: string; subLabel: string };
      hazop: { label: string; subLabel: string };
    };
    identifierLabel: string;
    placeholder: string;
    discard: string;
    initialize: string;
  };
  footer: {
    rights: string;
    privacy: string;
    terms: string;
    security: string;
    support: string;
  };
  notificationModal: {
    title: string;
    desc: string;
    allow: string;
    ignore: string;
  };
  pricing: {
    title: string;
    subtitle: string;
    basicName: string;
    basicPrice: string;
    basicDesc: string;
    basicFeatures: string[];
    proName: string;
    proPrice: string;
    proDesc: string;
    proFeatures: string[];
    currentPlan: string;
    upgradeBtn: string;
    security: string;
    stripe: string;
    taxNote: string;
    month: string;
  };
  landing: {
    heroTitle: string;
    heroSubtitle: string;
    cards: {
      simulation: { title: string; desc: string; button: string };
      piping: { title: string; desc: string; button: string };
      pid: { title: string; desc: string };
      hazop: { title: string; desc: string };
    };
    comingSoon: {
      badge: string;
      desc: string;
      notifyBtn: string;
      cancelBtn: string;
      successAlert: string;
    };
  };
  timeAgo: {
    justNow: string;
    minutes: string;
    hours: string;
    days: string;
    ago: string;
  };
};

const dictionaries: Record<Locale, Translations> = {
  en: {
    nav: { brand: "ProcAgent", adminName: "Kuku Admin" },
    invite: {
      button: "Invite Friends",
      title: "Invite & Get Credits",
      subtitle: "Share ProcAgent with your friends and boost your engineering together.",
      rewardLabel: "EACH GETS",
      rewardValue: "200 CREDITS",
      copyLink: "Copy Invite Link",
      copied: "Copied!",
      linkTitle: "YOUR UNIQUE INVITE LINK"
    },
    sidebar: {
      home: "Home",
      projects: "Projects",
      newChat: "New Chat",
      historySessions: "History Sessions",
      noSessions: "No sessions yet",
      sendFirstObjective: "Send your first objective",
      recent: "Recent",
      expand: "Expand Sidebar",
      collapse: "Collapse Sidebar"
    },
    common: {
      back: "Back",
      cancel: "Cancel",
      confirm: "Confirm",
      save: "Save",
      delete: "Delete",
      rename: "Rename",
      preview: "Preview",
      download: "Download",
      apply: "Apply",
      view: "View",
      more: "More",
      add_to_context: "Add to Context",
      noMatch: "No Match Found",
      all: "All",
      justNow: "Just now",
      loading: "Loading...",
      aiRecognition: "AI Recognition",
      updatedAt: "Updated",
      copied: "Copied!"
    },
    notifications: {
      title: "Notifications",
      empty: "No new notifications",
      markAllRead: "Mark all as read",
      viewAll: "View all notifications",
      time1: "10m ago",
      time2: "2h ago",
      types: {
        joined: "accepted the invite to join",
        removed: "You were removed from",
        removedSuffix: "",
      },
      mockProject1: "Quantum Core Interface",
      mockProject2: "Aero-Dynamics Shell V2"
    },
    menu: {
      editProfile: "Edit Profile",
      language: "Language",
      logout: "Log Out",
      version: "Version: v1.0.0",
      zh: "中文",
      en: "EN",
      aiCredit: "AI Credit",
      upgrade: "Upgrade",
      projectSource: "Project Source",
      created: "Created",
    },
    templateCard: { apply: "Apply", view: "View Template", applyAndCreate: "Apply & Create" },
    templateModal: {
      title: "Template Detail",
      apply: "Use this Template",
      cancel: "Cancel",
      selectProjectTitle: "Select Project",
      selectProjectSubtitle: "Choose where to create this document"
    },
    projectMenu: { 
      source: "PROJECT SOURCE",
      members: "Members", 
      membersHint: "Join to edit all sessions",
      rename: "Rename Project", 
      share: "Share",
      shareSuccess: 'Project "{name}" link copied to clipboard!',
      duplicate: "Duplicate",
      delete: "Delete Project" 
    },
    memberModal: { 
      title: "Project Members", 
      shareHint: "Members joining the project will be able to interactively edit all sessions.",
      copyLink: "Copy Invite Link", 
      remove: "Remove", 
      joined: "Joined",
      workspaceType: "Private Workspace"
    },
    deleteDocModal: {
      title: "Delete Document?",
      warning: "Warning: This action is irreversible. This document and all its data will be permanently deleted.",
      inputPrompt: "Please enter the document name to confirm:",
      inputPlaceholder: "Enter document name",
      confirmButton: "Confirm Delete",
    },
    docTypeModal: {
      title: "Create Document",
      subtitle: "Select document type",
      simulation: "Simulation",
      piping: "3D Piping",
      simulationDesc: "Build dynamic numerical models, fluid mechanics, and stress analysis docs.",
      pipingDesc: "Layout design, P&ID synchronization, and industrial 3D modeling docs.",
      fromTemplate: "Create from Template Library",
    },
    onboarding: {
      title: "Welcome to ProcAgent",
      intro: "A quick tour to help you get productive in under a minute.",
      featuresTitle: "What you can do",
      points: [
        "Start from templates to quickly generate structured workspaces for different industries.",
        "Create projects to organize documents, simulation notes, and 3D piping deliverables in one place.",
        "Open a template to preview details, then apply it to kick off your workflow.",
      ],
      templatesTitle: "Explore templates",
      templatesDesc: "Pick a template that matches your scenario, then click to view and apply.",
      templatesHint: "Tip: Click “More Templates” to browse the full library",
      templatesImageAlt: "Template preview",
      exploreTemplates: "Explore Templates",
      close: "Close",
    },
    templates: {
      title: "Templates",
      subtitle: "",
      browse: "More Templates",
      new: "New",
      allIndustries: "All Industries",
      countSuffix: "Templates",
      items: [
        { title: "Standard Editorial", desc: "Multi-column layout for deep reads.", longDesc: "A clean, professional multi-column layout optimized for long-form technical documentation and research papers.", category: "Editorial", isNew: true },
        { title: "Chemical Plant Piping", desc: "Advanced 3D piping & simulation.", longDesc: "Comprehensive 3D environment for chemical plant piping design. Includes real-time fluid dynamic simulation, pressure stress testing, and automated P&ID synchronization.", category: "Simulation", image: "/templates/chemical_plant.png" },
        { title: "3D Simulation Brief", desc: "Optimized for complex modeling docs.", longDesc: "A structured brief template designed to summarize 3D simulation results for executive review.", category: "Simulation" },
        { title: "Product Roadmap", desc: "Visual timelines for creative teams.", longDesc: "Strategic planning layout featuring visual timelines and milestone tracking for product development cycles.", category: "Planning" }
      ]
    },
    projects: {
      title: "Projects",
      subtitle: "Manage your ongoing engineering contexts and sessions across all modules.",
      filter: "Filter",
      add: "New Project",
      searchPlaceholder: "Search projects...",
      emptyHint: "Start by creating a new simulation or piping project.",
      titlePlaceholder: "Project Title...",
      updated: "Updated",
      ago: "h ago",
      daysAgo: "d ago",
      noProjectSelected: "No project selected. Return to the dashboard to select one.",
      backToHome: "Back to Dashboard",
      projectFiles: "Project Files",
      projectParams: "Project Parameters",
      noAttachments: "No Attachments",
      uploadNew: "Upload New",
      assets: "ASSETS",
      attachmentsTitle: "Project Attachments",
      simulationCases: [
        { id: "c1", title: "Steady State Setup", desc: "Initialize a steady state simulation for a distillation column.", img: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=400", prompt: "Set up a new steady state simulation for a crude distillation unit with 15 stages." },
        { id: "c2", title: "Dynamic Transition", desc: "Convert steady state to dynamic simulation to study startup behavior.", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400", prompt: "Convert the current distillation model to dynamic mode and add PI controllers for level." },
        { id: "c3", title: "Optimization Run", desc: "Run a sensitivity analysis on reflux ratio vs energy consumption.", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400", prompt: "Set up a sensitivity analysis varying the reflux ratio from 1.0 to 3.0 and plot condenser duty." }
      ],
      pipingCases: [
        { id: "c4", title: "Auto-Routing", desc: "Generate automatic pipe routes connecting pump discharge to exchanger.", img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=400", prompt: "Auto-route a 6-inch carbon steel pipe from Pump P-101A discharge nozzle to Exchanger E-100 tube side inlet." },
        { id: "c5", title: "Clash Detection", desc: "Run a hard clash test against structural steel beams.", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400", prompt: "Run a clash detection study for the new pipe rack layout against existing structural columns." },
        { id: "c6", title: "Isometric Gen", desc: "Generate isometric drawings with BOM for fabricated spools.", img: "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&q=80&w=400", prompt: "Generate isometric extraction for line numbers L-1001 to L-1005 including standard BOM." }
      ],
      parameters: "Parameters",
      parameterCategories: {
        Process: "Process",
        Equipment: "Equipment"
      },
      sandboxSubtitle: "choose a template to begin, or describe your requirements",
      sandboxTitle: "What would you like to build today?",
      tags: {
        piping: "3D PIPING",
        simulation: "SIMULATION",
        pid: "P&ID",
        hazop: "HAZOP",
      },
      items: [
        { title: "Petro-Helix Pipeline Alpha", tags: [] },
        { title: "Aero-Dynamics Shell V2", tags: [] },
        { title: "Quantum Core Interface", tags: [] }
      ]
    },
    workDoc: {
      title: "Work Documents",
      createButton: "Create Document",
      emptyState: "No documents yet. Click the button to create one.",
      noMatch: "No matching documents found.",
      createdAt: "Created",
      updatedAt: "Updated",
      defaultTitlePrefix: "Doc",
      simulation: "Simulation",
      piping: "3D Piping",
    },
    document: {
      noDocSelected: "No document selected. Please go back and choose one.",
      backToProject: "Back to Project",
      workspaceBreadcrumb: "Workspace",
      newMessage: "[New Message] You have a new reply",
      chat: "CHAT",
      connected: "Connected",
      disconnected: "Disconnected",
      interactive: "Interactive",
      aiAssistant: "ProcAgent AI",
      aiPlaceholder: "Describe a process...",
      send: "Send",
      simulationCanvasReady: "Simulation Canvas Ready",
      simulationCanvasDesc: "Drag components from the left panel to begin",
      connectButton: "Connect",
      toggleConnection: "Toggle Connection",
      fullscreen: "Fullscreen",
      simulationEngineOffline: "Simulation Engine Offline",
      simulationEngineDesc: "Click the connect button above to start a simulation session",
      receivedMsg: "Received.",
      analyzingMsg: "Analyzing your process description, please wait...",
      agentOperating: "Agent Operating",
      needsIntervention: "Needs Intervention",
      pfd: "PFD",
      feeds: "Feeds",
      quickStart: "Quick Start",
      tapToFill: "Tap to fill",
      stop: "Stop",
      identifiedParams: "Identified {count} parameters",
      viewDetail: "VIEW",
      expandLiveView: "Expand Live View",
      collapseLiveView: "Collapse Live View",
      collapse: "Collapse",
      expand: "Expand",
      aiRecognitionMsg: "AI Recognition",
      assistant: "Assistant",
      liveView: "Live View",
      engineActive: "Engine Active",
      engineOffline: "Engine Offline",
      engineActiveDesc: "Data link established. Models and renders will appear here.",
      engineOfflineDesc: "Start a case or connect to the server to establish a data stream.",
      connectServer: "Connect to Local Server",
      welcomeBack: "Welcome back to the session.",
      routingPrompt: "It looks like you want to do 3D Piping design in a Simulation project. Would you like to switch to a Piping context?",
      routingPromptTitle: "Create a 3D Piping Project to Continue",
      routingPromptBody: "It seems you are trying to perform 3D Piping tasks. Switch to a Piping project to access specialized tools and routing engines.",
      goToProjects: "Go to Projects",
      memoryUpdatedTitle: "Current project memory updated",
      memoryUpdatedBody: "",
      memoryUpdatedAck: "I've noted that for you. My internal memory has been updated.",
      processedMsg: 'I have processed your request: "{text}". The parameters have been updated accordingly.',
      templateApplyPrompt: "Applying this template will load the system prompt, prepare default mock attachments, and paste the starting query into your chatbox naturally integrating the context into your session memory.",
      aiRecognition: "AI Recognition",
      tasks: {
        initializing: "Initializing simulation...",
        parsing: "Parsing topology",
        extracting: "Extracting mass balance",
        matching: "Matching pipe specs",
        checking: "Checking boundaries",
        generating: "Generating sequence",
      },
      quickPrompts: [
        { id: "overview", title: "Outline the process", prompt: "Please break down this process into key steps, inputs, outputs, and major equipment." },
        { id: "simulation", title: "Build a simulation plan", prompt: "Based on this document, give me an actionable simulation setup plan and parameter checklist." },
        { id: "risks", title: "Spot the risk points", prompt: "Identify likely operational risks, control points, and validation checkpoints in this process." },
        { id: "materials", title: "List missing inputs", prompt: "What extra documents, operating conditions, and parameters do I still need before starting the simulation?" }
      ]
    },
    fileUpload: {
      dropzoneActive: "Release to upload files",
      dropzoneInactive: "Drag files here, or click to upload",
      supportAll: "Supports all file formats",
    },
    configTable: {
      name: "NAME",
      value: "VALUE",
      unit: "UNIT",
      actions: "ACTIONS",
      params: "PARAMS",
      newParam: "New Param",
      manual: "Manual",
      noParam: "No parameters yet. Click below to add.",
      addParam: "Add Parameter"
    },
    createProject: {
      title: "Create Project",
      nameLabel: "Project Identifier",
      namePlaceholder: "e.g. Quantum Core Interface",
      tagsLabel: "Initial Tags",
      createButton: "Create Project"
    },
    newProjectModal: {
      title: "New Project",
      subtitle: "INITIALIZE WORKSPACE",
      typeLabel: "SPECIALIZED ENGINEERING TYPE",
      types: {
        simulation: { label: "Simulation", subLabel: "NUMERICAL CORE" },
        piping: { label: "3D Piping", subLabel: "SPATIAL DESIGN" },
        pid: { label: "P&ID", subLabel: "FLOW SCHEMATIC" },
        hazop: { label: "HAZOP", subLabel: "LOGIC SAFETY" },
      },
      identifierLabel: "PROJECT IDENTIFIER",
      placeholder: "Naming the artifact...",
      discard: "Discard",
      initialize: "Create Project",
    },
    footer: { rights: "All rights reserved.", privacy: "Privacy Policy", terms: "Terms of Service", security: "Security", support: "Support" },
    notificationModal: {
      title: "Enable Real-time Notifications",
      desc: "Allow notifications to stay updated when tasks are completed or require your intervention, even when you are in another tab.",
      allow: "Enable Now",
      ignore: "Maybe Later"
    },
    pricing: {
      title: "Upgrade Your Plan",
      subtitle: "Unlock the next generation of industrial simulation workspace.",
      basicName: "Basic",
      basicPrice: "Free",
      basicDesc: "Basic features for independent engineers.",
      basicFeatures: ["200 Credits / Month", "Basic Simulation", "Community Support"],
      proName: "Pro",
      proPrice: "$29",
      proDesc: "Advanced tools for professional teams.",
      proFeatures: ["Unlimited Credits", "High-Priority Compute", "4K Simulation Exports", "24/7 Priority Support"],
      currentPlan: "Current Plan",
      upgradeBtn: "Upgrade Now",
      security: "Security Guaranteed",
      stripe: "Powered by Stripe",
      taxNote: "Pricing inclusive of all regional taxes",
      month: "/ month",
    },
    landing: {
      heroTitle: "Boost your Engineering 10X",
      heroSubtitle: "Accelerate your industrial workflow with AI-driven workspaces. Start a new session instantly to simulate, design, and optimize engineering projects with tenfold speed.",
      cards: {
        simulation: { title: "Process Simulation", desc: "Start an interactive simulation session with defined inputs and outputs.", button: "Start Project" },
        piping: { title: "3D Piping Design", desc: "Generate 3D pipe routing models based on equipment coordinates.", button: "Start Project" },
        pid: { title: "P&ID Generation", desc: "Intelligent drafting of piping and instrumentation diagrams." },
        hazop: { title: "HAZOP Analysis", desc: "Automated hazard and operability study documentation." }
      },
      comingSoon: {
        badge: "Coming Soon",
        desc: "We are working hard on this module. Leave your mark and we will notify you as soon as it goes live.",
        notifyBtn: "Apply for Beta — Notify Me",
        cancelBtn: "Not now, check later",
        successAlert: "Added to waitlist! We will notify you via email once it's live."
      }
    },
    timeAgo: {
      justNow: "Just now",
      minutes: "m",
      hours: "h",
      days: "d",
      ago: "ago"
    }
  },
  zh: {
    nav: { brand: "ProcAgent", adminName: "Kuku 管理员" },
    invite: {
      button: "邀请奖励",
      title: "邀请好友得奖励",
      subtitle: "将 ProcAgent 分享给好友，共同提升工程效率。",
      rewardLabel: "各得奖励",
      rewardValue: "200 积分",
      copyLink: "复制邀请链接",
      copied: "已复制",
      linkTitle: "您的专属专用邀请链接"
    },
    sidebar: {
      home: "首页",
      projects: "我的项目",
      newChat: "开启新对话",
      historySessions: "历史会话记录",
      noSessions: "暂无会话",
      sendFirstObjective: "发送您的第一个目标",
      recent: "最近会话",
      expand: "展开边栏",
      collapse: "收起边栏"
    },
    common: {
      back: "返回",
      cancel: "取消",
      confirm: "确认",
      save: "保存",
      delete: "删除",
      rename: "重命名",
      preview: "预览",
      download: "下载",
      apply: "应用",
      view: "查看",
      more: "更多",
      add_to_context: "添加至上下文",
      noMatch: "无匹配内容",
      all: "全部",
      justNow: "刚刚",
      loading: "加载中...",
      aiRecognition: "AI 识别",
      updatedAt: "更新于",
      copied: "已复制"
    },
    notifications: {
      title: "消息通知",
      empty: "暂无新消息",
      markAllRead: "全部标记为已读",
      viewAll: "查看全部通知",
      time1: "10分钟前",
      time2: "2小时前",
      types: {
        joined: "通过邀请加入了项目",
        removed: "您从",
        removedSuffix: "被移除",
      },
      mockProject1: "量子核心中控台",
      mockProject2: "航空动力学全款 V2"
    },
    menu: {
      editProfile: "修改名称",
      language: "切换语言",
      logout: "退出登录",
      version: "当前版本: v1.0.0",
      zh: "中文",
      en: "EN",
      aiCredit: "AI 算力",
      upgrade: "升级",
      projectSource: "项目源信息",
      created: "创建于",
    },
    templateCard: { apply: "应用", view: "查看模板", applyAndCreate: "应用并创建" },
    templateModal: {
      title: "模板详情预览",
      apply: "使用此模板",
      cancel: "取消预览",
      selectProjectTitle: "选择目标项目",
      selectProjectSubtitle: "请选择在该项目下创建此文档"
    },
    projectMenu: { 
      source: "项目源信息",
      members: "成员列表", 
      membersHint: "加入以编辑所有会话",
      rename: "重命名项目", 
      share: "共享协作",
      shareSuccess: '项目 "{name}" 的访问链接已复制到剪贴板！',
      duplicate: "复制项目",
      delete: "删除项目" 
    },
    memberModal: { 
      title: "项目成员", 
      shareHint: "加入项目的成员将可以对所有项目内会话进行交互编辑",
      copyLink: "复制邀请链接", 
      remove: "移除用户", 
      joined: "加入于",
      workspaceType: "私有项目空间"
    },
    deleteDocModal: {
      title: "删除文档？",
      warning: "警告：此操作不可恢复。此文档及其所有关联数据将被永久删除。",
      inputPrompt: "请输入文档名称以确认：",
      inputPlaceholder: "输入文档名称",
      confirmButton: "确认删除此文档",
    },
    docTypeModal: {
      title: "创建工作文档",
      subtitle: "选择文档类型",
      simulation: "模拟仿真",
      piping: "3D 配管",
      simulationDesc: "构建动态数值模型、流体力学与压力应力分析文档。",
      pipingDesc: "管线排布、P&ID 同步与工业级三维空间设计文档。",
      fromTemplate: "从模板库中创建",
    },
    onboarding: {
      title: "欢迎来到 ProcAgent",
      intro: "1 分钟快速上手，带你了解核心功能。",
      featuresTitle: "你可以做什么",
      points: [
        "从模板开始，快速生成适配不同行业的结构化工作区。",
        "创建项目，将文档、仿真记录与 3D 配管交付物统一管理。",
        "点击模板查看详情并应用，一键开启你的工作流。",
      ],
      templatesTitle: "从模板探索",
      templatesDesc: "选择符合场景的模板，点击查看并应用到项目。",
      templatesHint: "提示：点击“更多模板”浏览完整模板库",
      templatesImageAlt: "模板预览",
      exploreTemplates: "去模板库探索",
      close: "关闭",
    },
    templates: {
      title: "模板库",
      subtitle: "",
      browse: "更多模板",
      new: "全新",
      allIndustries: "全部行业",
      countSuffix: "个模板",
      items: [
        { title: "标准文章布局", desc: "适用于深度阅读的多列内容排版", longDesc: "专为深度技术文档和研究报告优化的多列布局，提供极致的阅读体验。", category: "文章排版", isNew: true },
        { title: "华工管线设计仿真", desc: "高阶 3D 配管与数值模拟仿真", longDesc: "针对大型化工生产线的 3D 管线设计环境。内置实时流体力学模拟、压力应力测试以及自动化的 P&ID 数据同步系统。", category: "工业仿真", image: "/templates/chemical_plant.png" },
        { title: "3D 实体模拟简报", desc: "针对高复杂度管线模型的审查格式", longDesc: "结构化的简报模板，旨在为专家评审总结 3D 模拟结果和核心风险点。", category: "工业仿真" },
        { title: "项目路线图", desc: "供设计及开发团队对齐的时间轴", longDesc: "战略规划布局，通过直观的时间轴和里程碑追踪产品开发周期。", category: "项目规划" }
      ]
    },
    projects: {
      title: "项目空间",
      subtitle: "管理您在所有模块中正在进行的工程上下文和会话。",
      filter: "筛选过滤",
      add: "新项目",
      searchPlaceholder: "搜索项目...",
      emptyHint: "通过创建新的仿真模拟或 3D 配管项目来开始。",
      titlePlaceholder: "输入项目名称...",
      updated: "内容更新于",
      ago: " 小时前",
      daysAgo: " 天前",
      noProjectSelected: "未选择项目，请返回工作台选择。",
      backToHome: "返回工作台",
      projectFiles: "项目附件",
      projectParams: "项目参数",
      noAttachments: "暂无附件",
      uploadNew: "上传新文件",
      assets: "附件",
      attachmentsTitle: "项目附件列表",
      simulationCases: [
        { id: "c1", title: "稳态模型建立", desc: "初始化精馏塔的稳态模拟环境。", img: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=400", prompt: "为 15 块塔板的常压精馏装置建立新的稳态模拟。" },
        { id: "c2", title: "动态特性切换", desc: "将稳态模型转换为动态模拟，以研究开车行为。", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400", prompt: "将当前的精馏模型转换为动态模式，并添加液位 PI 控制器。" },
        { id: "c3", title: "全局优化运行", desc: "进行回流比与能耗关系的敏感性分析。", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400", prompt: "设定敏感性分析，将回流比从 1.0 变量至 3.0，并绘制冷凝器负荷曲线。" }
      ],
      pipingCases: [
        { id: "c4", title: "管道自动路由", desc: "自动生成连接泵出口与换热器的管路路由。", img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=400", prompt: "自动生成一条从泵 P-101A 出口喷嘴到换热器 E-100 管程入口的 6 英寸碳钢管道。" },
        { id: "c5", title: "硬碰撞碰撞检测", desc: "运行针对结构钢梁的硬碰撞测试。", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400", prompt: "针对新的管廊布局运行与现有建筑柱的碰撞检测研究。" },
        { id: "c6", title: "单线图 ISO 生成", desc: "为预制管段生成含材料表（BOM）的单线图。", img: "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&q=80&w=400", prompt: "为管线编号 L-1001 至 L-1005 生成单线图导出，包含标准 BOM。" }
      ],
      parameters: "关键参数",
      parameterCategories: {
        Process: "过程参数",
        Equipment: "设备参数"
      },
      sandboxSubtitle: "选择模板开始执行，或者描述你的需求",
      sandboxTitle: "今天想构建什么？",
      tags: {
        piping: "3D配管",
        simulation: "仿真模拟",
        pid: "P&ID 智能生成",
        hazop: "HAZOP 危害分析",
      },
      items: [
        { title: "石油螺旋管线 Alpha", tags: [] },
        { title: "航空动力学全款 V2", tags: [] },
        { title: "量子核心中控台", tags: [] }
      ]
    },
    workDoc: {
      title: "工作文档",
      createButton: "创建工作文档",
      emptyState: "尚无工作文档，点击右上角创建",
      noMatch: "暂无匹配的文档",
      createdAt: "创建于",
      updatedAt: "更新于",
      defaultTitlePrefix: "文档",
      simulation: "模拟仿真",
      piping: "3D 配管",
    },
    document: {
      noDocSelected: "未选中文档，请返回项目页选择。",
      backToProject: "返回项目",
      workspaceBreadcrumb: "文档工作区",
      newMessage: "【新消息】您有一条未读回复",
      chat: "对话",
      connected: "已连接",
      disconnected: "未连接",
      interactive: "交互中",
      aiAssistant: "ProcAgent AI",
      aiPlaceholder: "描述工艺流程...",
      send: "发送",
      simulationCanvasReady: "仿真画布已就绪",
      simulationCanvasDesc: "从左侧面板拖入组件以开始建模",
      connectButton: "启动连接",
      toggleConnection: "切换连接",
      fullscreen: "全屏",
      simulationEngineOffline: "仿真引擎未连接",
      simulationEngineDesc: "点击右上角连接按钮以启动仿真会话",
      receivedMsg: "收到。",
      analyzingMsg: "正在分析您的工艺描述，请稍候...",
      agentOperating: "Agent 操作中",
      needsIntervention: "需要介入",
      pfd: "流程图",
      feeds: "进料工况",
      quickStart: "快捷开始",
      tapToFill: "点击填充问题",
      stop: "中止",
      identifiedParams: "识别到 {count} 个参数，已记录",
      viewDetail: "查看",
      expandLiveView: "展开 Live View",
      collapseLiveView: "收起 Live View",
      collapse: "收起",
      expand: "展开",
      aiRecognitionMsg: "AI 消息识别",
      assistant: "智能助手",
      liveView: "实时视图",
      engineActive: "仿真引擎在线",
      engineOffline: "仿真引擎离线",
      engineActiveDesc: "数据链路已建立。模型与渲染结果将在此处显示。",
      engineOfflineDesc: "启动案例或连接到服务器以建立数据流。",
      connectServer: "连接到本地服务器",
      welcomeBack: "欢迎回来。",
      routingPrompt: "看起来你想在仿真项目进行 3D 配管设计。是否切换到配管上下文？",
      routingPromptTitle: "请创建3D配管项目继续",
      routingPromptBody: "系统检测到您的操作涉及 3D 配管。建议前往项目列表创建专门的配管项目，以获得完整的路由引擎和 3D 编辑支持。",
      goToProjects: "前往项目列表",
      memoryUpdatedTitle: "当前项目记忆已更新",
      memoryUpdatedBody: "",
      memoryUpdatedAck: "好的，我已经记下了您的要求，相关信息已同步至项目记忆。",
      processedMsg: '我已处理您的请求："{text}"。参数已相应更新。',
      templateApplyPrompt: "应用此模板将加载系统提示词，准备默认模拟附件，并将起始查询自然地集成到您的会话记忆中。",
      aiRecognition: "AI 识别",
      tasks: {
        initializing: "正在初始化仿真引擎...",
        parsing: "正在解析工艺拓扑",
        extracting: "提取物料横算数据",
        matching: "匹配管线规格",
        checking: "检查工况边界",
        generating: "生成仿真序列",
      },
      quickPrompts: [
        { id: "overview", title: "梳理工艺流程", prompt: "请帮我梳理这份工艺流程的关键步骤、输入输出和主要设备。" },
        { id: "simulation", title: "生成仿真方案", prompt: "基于当前文档，请给我一个可执行的仿真建模方案和参数准备清单。" },
        { id: "risks", title: "识别风险点", prompt: "请指出这个流程里可能存在的操作风险、控制点和需要重点验证的环节。" },
        { id: "materials", title: "列出准备材料", prompt: "为了开始仿真，我还需要补充哪些文档、参数和工况数据？" }
      ]
    },
    fileUpload: {
      dropzoneActive: "松开以上传文件",
      dropzoneInactive: "拖拽文件至此处，或点击上传",
      supportAll: "支持任意格式文件",
    },
    configTable: {
      name: "参数名称",
      value: "数值",
      unit: "单位",
      actions: "操作",
      params: "参数",
      newParam: "新参数",
      manual: "手动新增",
      noParam: "暂无参数，点击下方按钮新增",
      addParam: "新增参数项目"
    },
    createProject: {
      title: "创建项目",
      nameLabel: "项目标识名称",
      namePlaceholder: "例如：量子核心中控台",
      tagsLabel: "初始标签",
      createButton: "创建项目"
    },
    newProjectModal: {
      title: "新建项目",
      subtitle: "初始化工作区",
      typeLabel: "选择工程类型",
      types: {
        simulation: { label: "仿真模拟", subLabel: "数值核心" },
        piping: { label: "3D 配管", subLabel: "空间设计" },
        pid: { label: "P&ID", subLabel: "流程图绘制" },
        hazop: { label: "HAZOP", subLabel: "安全逻辑" },
      },
      identifierLabel: "项目标识名称",
      placeholder: "为项目命名...",
      discard: "取消",
      initialize: "创建项目",
    },
    footer: { rights: "保留全球所有版权.", privacy: "隐私政策条例", terms: "服务及使用条款", security: "数据安全声明", support: "在线技术支持" },
    notificationModal: {
      title: "开启实时任务提醒",
      desc: "授权通知权限，以便在 Agent 完成任务或需要您介入时及时收到提醒，即使您正在处理其他工作。",
      allow: "立即开启",
      ignore: "暂不开启"
    },
    pricing: {
      title: "升级您的方案",
      subtitle: "解锁下一代工业仿真工作空间。",
      basicName: "基础版",
      basicPrice: "免费",
      basicDesc: "适用于独立工程师的基础功能。",
      basicFeatures: ["每月 200 个积分", "基础仿真功能", "社区支持"],
      proName: "专业版",
      proPrice: "¥199",
      proDesc: "适用于专业团队的高级工具。",
      proFeatures: ["无限积分", "高优先级计算", "4K 仿真导出", "24/7 优先支持"],
      currentPlan: "当前方案",
      upgradeBtn: "立即升级",
      security: "安全保障",
      stripe: "由 Stripe 提供支持",
      taxNote: "价格已包含所有地区税费",
      month: "/ 月",
    },
    landing: {
      heroTitle: "让工程效能提升 10 倍",
      heroSubtitle: "通过 AI 驱动的工作空间加速您的工业工作流。即刻启动新会话，以十倍速模拟、设计和优化工程项目。",
      cards: {
        simulation: { title: "流程模拟仿真", desc: "开启一个带有预设输入和输出的交互式模拟会话。", button: "开启项目" },
        piping: { title: "3D 配管设计", desc: "基于设备坐标自动生成 3D 管道路由模型。", button: "开启项目" },
        pid: { title: "P&ID 智能生成", desc: "工艺流程图与仪表图的智能化快速草绘。" },
        hazop: { title: "HAZOP 危害分析", desc: "自动化的危险与可操作性研究文档生成。" }
      },
      comingSoon: {
        badge: "敬请期待",
        desc: "我们正在全力研发该模块。请留下你的足迹，上线的第一时间我们会通知你。",
        notifyBtn: "申请内测 — 第一时间通知我",
        cancelBtn: "暂不申请，稍后再看",
        successAlert: "已加入内测名单，上线后我们将第一时间通过邮件通知你！"
      }
    },
    timeAgo: {
      justNow: "刚刚",
      minutes: "分钟",
      hours: "小时",
      days: "天",
      ago: "前"
    }
  }
};

const LanguageContext = createContext<{ locale: Locale; setLocale: (l: Locale) => void; t: Translations }>({
  locale: 'zh',
  setLocale: () => {},
  t: dictionaries.zh
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>('zh');

  // Sync HTML lang attribute with current locale
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: dictionaries[locale] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
