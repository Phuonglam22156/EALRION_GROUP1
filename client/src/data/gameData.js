// ═══════════════════════════════════════════════════════════════
// ELARION: War of Six Elements — Game Data
// ═══════════════════════════════════════════════════════════════

export const PRODUCT = {
  id: 'elarion-board-game',
  name: 'ELARION: War of Six Elements',
  tagline: 'Board Game Fantasy Chiến Thuật',
  price: 300000,
  originalPrice: 450000,
  currency: 'VND',
  stock: 50,
  lowStockThreshold: 5,
  difficulty: 'Trung bình',
  players: '2–6 người',
  playTime: '45–90 phút',
  ages: '12+',
  description:
    'ELARION là board game fantasy chiến thuật lấy bối cảnh tại thế giới Elarion — nơi tồn tại sáu tộc hệ đại diện cho các sức mạnh khác nhau. Một biến cố mang tên "Đại Nứt Gãy" xảy ra khiến nguồn mana bị thất lạc và sự cân bằng của Elarion dần sụp đổ. Nhập vai thành các chiến binh, sử dụng kỹ năng đặc trưng, chiến thuật và quản lý tài nguyên mana để chiến đấu và giành chiến thắng.',
};

export const COMPONENTS = [
  { name: 'Hộp game', detail: '32.8cm × 27.8cm', icon: '📦', qty: 1 },
  { name: 'Sách hướng dẫn', detail: 'Khổ A6', icon: '📖', qty: 1 },
  { name: 'Bản đồ game', detail: '51cm × 51cm', icon: '🗺️', qty: 1 },
  { name: 'Xúc xắc', detail: '1.2cm × 1.2cm', icon: '🎲', qty: 1 },
  { name: 'Tượng nhân vật', detail: '2cm × 7cm', icon: '♟️', qty: 6 },
  { name: 'Đế nhân vật', detail: '2cm', icon: '🔘', qty: 6 },
  { name: 'Thẻ nhân vật', detail: '6cm × 9cm — tên & kỹ năng', icon: '🃏', qty: 6 },
  { name: 'Thẻ kỹ năng', detail: '6cm × 6cm — Luck & Omen', icon: '✨', qty: 20 },
  { name: 'Thẻ thiên tai', detail: '2cm × 2cm', icon: '🌋', qty: 16 },
  { name: 'Token Mana', detail: 'Tài nguyên', icon: '💎', qty: 46 },
];

export const FACTIONS = [
  {
    id: 'horologia',
    name: 'Horologia',
    title: 'Tộc Thời Gian',
    color: '#4A90D9',
    colorDark: '#2A5A8A',
    colorGlow: 'rgba(74, 144, 217, 0.4)',
    icon: '⏳',
    symbol: 'Đồng hồ cát',
    character: {
      name: 'Noctis',
      epithet: 'The Time Keeper',
      background:
        'Noctis sinh ra trong Tộc Horologia — nơi mọi người đều thức tỉnh sức mạnh siêu nhiên từ rất sớm. Tuy nhiên, đến năm 18 tuổi, cô vẫn chưa biểu hiện bất kỳ năng lực nào, trở thành nỗi thất vọng lớn nhất của bộ tộc. Dù vậy, Noctis không bao giờ từ bỏ niềm đam mê với thời gian và những chiếc đồng hồ cổ. Một ngày, khi khám phá căn phòng cấm, cô chạm vào chiếc đồng hồ phong ấn và đánh thức sức mạnh ngủ quên bên trong — khả năng thao túng thời gian, đảo ngược các sự kiện.',
      power: 'Time Manipulation',
      manaCost: 2,
      abilityName: 'Time Reversal',
      abilityDesc:
        'Người chơi có thể quay trở lại vị trí trước khi tung xúc xắc gần nhất, đảo ngược di chuyển của lượt hiện tại.',
    },
  },
  {
    id: 'infinicore',
    name: 'Infinicore',
    title: 'Tộc Không Gian',
    color: '#9B59B6',
    colorDark: '#6C3483',
    colorGlow: 'rgba(155, 89, 182, 0.4)',
    icon: '∞',
    symbol: 'Infinity',
    character: {
      name: 'Veyron',
      epithet: 'The Space Wanderer',
      background:
        'Veyron sinh ra trong Tộc Infinicore — nền văn minh duy nhất không sở hữu năng lực siêu nhiên bẩm sinh. Để bù đắp, họ cống hiến cho tri thức và công nghệ, phát triển giáp, vũ khí và thiết bị có thể thao túng quy luật không gian. Được công nhận là thiên tài lỗi lạc nhất thế hệ, Veyron chế tạo bộ giáp đặc biệt cho phép dịch chuyển tức thời. Dù sở hữu trí tuệ phi thường, anh nổi tiếng với tính cách lập dị và liều lĩnh.',
      power: 'Space Manipulation',
      manaCost: 3,
      abilityName: 'Spatial Shift',
      abilityDesc:
        'Người chơi có thể dịch chuyển tức thời đến bất kỳ ô nào trong bán kính 6 ô, cho phép di chuyển nhanh và tái định vị chiến lược.',
    },
  },
  {
    id: 'reveria',
    name: 'Reveria',
    title: 'Tộc Mộng Mơ',
    color: '#E8A0BF',
    colorDark: '#A0607F',
    colorGlow: 'rgba(232, 160, 191, 0.4)',
    icon: '🌙',
    symbol: 'Trăng khuyết',
    character: {
      name: 'Selphira',
      epithet: 'The Dream Weaver',
      background:
        'Selphira sinh ra trong hoàng tộc Reveria — dòng dõi được ban phước khả năng tạo ra những giấc mơ đẹp, chữa lành trái tim tổn thương. Tuy nhiên, là người thừa kế duy nhất, cô sống cả đời dưới áp lực và kỳ vọng, dần mất đi tự do. Sự cô đơn biến đổi sức mạnh của cô — từ món quà an ủi trở thành thôi miên nguy hiểm. Cô có thể thao túng suy nghĩ và hành động của người khác.',
      power: 'Dream Manipulation',
      manaCost: 3,
      abilityName: 'Mind Control',
      abilityDesc:
        'Người chơi có thể ép một người chơi khác giao nộp một rương tiếp tế hoặc một thẻ kỹ năng.',
    },
  },
  {
    id: 'arboris',
    name: 'Arboris',
    title: 'Tộc Hộ Vệ',
    color: '#27AE60',
    colorDark: '#1A7A42',
    colorGlow: 'rgba(39, 174, 96, 0.4)',
    icon: '🛡️',
    symbol: 'Khiên',
    character: {
      name: 'Druvis',
      epithet: 'The Guardian of Arboris',
      background:
        'Sâu trong nền văn minh rừng cổ đại Arboris đứng sừng sững cây thế giới khổng lồ đã canh giữ tự nhiên hàng thế kỷ. Khu rừng thịnh vượng trong hòa bình cho đến khi chiến tranh lan rộng, mang theo lửa, hủy diệt và đau khổ. Khi rừng héo úa, nỗi đau tập thể của tự nhiên đánh thức ý thức bên trong cây cổ thụ. Nó từ bỏ hình dạng cố định và hóa thân thành Druvis — người hộ vệ bất khả chiến bại.',
      power: 'Absolute Defense',
      manaCost: 2,
      abilityName: 'Divine Shield',
      abilityDesc:
        'Người chơi trở nên miễn nhiễm với tấn công và hiệu ứng thù địch từ đối thủ trong thời gian quy định.',
    },
  },
  {
    id: 'raikage',
    name: 'Raikage',
    title: 'Tộc Sấm Sét',
    color: '#F39C12',
    colorDark: '#B87A0A',
    colorGlow: 'rgba(243, 156, 18, 0.4)',
    icon: '⚡',
    symbol: 'Tia sét',
    character: {
      name: 'Inazumi',
      epithet: 'The Thunder Empress',
      background:
        'Sinh ra trong Tộc Raikage danh giá, Inazumi thừa hưởng sức mạnh sấm sét từ khoảnh khắc chào đời. Mỗi khi cảm xúc bất ổn, bão tố tụ lại trên đầu và dòng điện chạy khắp cơ thể. Bị sợ hãi bởi những người xung quanh, cô dần trở nên xa cách và lạnh lùng. Trong một trận chiến ác liệt, Inazumi phát hiện sét của mình không chỉ là vũ khí mà còn là phương tiện kiểm soát chiến trường.',
      power: 'Thunder Control',
      manaCost: 2,
      abilityName: 'Lightning Strike',
      abilityDesc:
        'Người chơi có thể nhắm vào một vùng tiếp tế hoặc người chơi khác. Nếu nhắm vùng tiếp tế, đối thủ tạm thời không thể vào khu vực đó. Nếu nhắm người chơi, đối thủ mất lượt tiếp theo.',
    },
  },
  {
    id: 'shapeshifter',
    name: 'Shapeshifter',
    title: 'Tộc Biến Hình',
    color: '#E74C3C',
    colorDark: '#A93226',
    colorGlow: 'rgba(231, 76, 60, 0.4)',
    icon: '🐺',
    symbol: 'Sói',
    character: {
      name: 'Fenrir',
      epithet: 'The Alpha Werewolf',
      background:
        'Fenrir là thủ lĩnh của Tộc Biến Hình, sinh ra dưới Trăng Đỏ hiếm gặp — điềm báo đánh dấu sự ra đời của Alpha thực sự. Từ nhỏ, anh đã thể hiện sức mạnh phi thường, bản năng xuất sắc và tinh thần trách nhiệm kiên định. Với Fenrir, bảo vệ bộ tộc là lời thề thiêng liêng. Khi đối mặt kẻ thù, Fenrir tung ra tiếng hú tràn đầy năng lượng nguyên thủy, áp đảo tâm trí đối phương.',
      power: 'Primal Fear',
      manaCost: 3,
      abilityName: 'Terror Howl',
      abilityDesc:
        'Fenrir phát ra tiếng hú gây sợ hãi ảnh hưởng tất cả người chơi khác trên bàn. Người chơi bị ảnh hưởng hoảng loạn và không thể hành động trong lượt tiếp theo.',
    },
  },
];

export const GAME_SYSTEMS = [
  {
    id: 'map',
    title: 'Bản Đồ Game',
    icon: '🗺️',
    description:
      'Bản đồ game bao gồm đường đi chính và nhiều vùng tiếp tế trải rộng khắp bản đồ. Khi đi qua đường đi, người chơi có thể gặp các ô sự kiện ảnh hưởng đáng kể đến trò chơi: di chuyển lên/xuống nhiều ô, dịch chuyển đến ô bất kỳ, mất một lượt, hoặc rút thẻ kỹ năng.',
  },
  {
    id: 'mana',
    title: 'Hệ Thống Mana',
    icon: '💎',
    description:
      'Mana là yếu tố then chốt cho phép người chơi tích lũy điểm, tìm thấy tại các vùng tiếp tế trên bản đồ. Hết mana = bị loại ngay lập tức!',
    details: [
      { label: 'Vùng Mana Thấp', text: 'Chứa 1 mana. Lấy không cần hành động thêm.' },
      {
        label: 'Vùng Mana Cao',
        text: 'Chứa 2–3 mana. Ngoài lấy mana, phải rút thẻ sự kiện.',
      },
    ],
  },
  {
    id: 'skill',
    title: 'Thẻ Kỹ Năng',
    icon: '✨',
    description:
      'Khi người chơi đứng trên ô thẻ kỹ năng, họ rút một thẻ và sử dụng ngay trong lượt đó. Thẻ kỹ năng có thể mang lại lợi ích hoặc bất lợi.',
  },
  {
    id: 'event',
    title: 'Thẻ Sự Kiện',
    icon: '🌋',
    description:
      'Thẻ sự kiện được rút khi vào vùng tiếp tế cao hoặc khi tất cả người chơi hoàn thành một vòng. Thẻ giới thiệu các yếu tố môi trường và thay đổi bản đồ liên quan đến phá hủy lãnh thổ. Nếu đứng trên lãnh thổ bị phá hủy, mất 1 mana và quay về ô xuất phát.',
  },
];

export const GAMEPLAY_PHASES = [
  {
    id: 'movement',
    title: 'Pha Di Chuyển',
    icon: '🎲',
    description:
      'Mỗi người chơi tung xúc xắc và di chuyển số ô tương ứng. Để vào vùng tiếp tế, người chơi cần đứng trên ô liên kết với vùng đó.',
  },
  {
    id: 'interaction',
    title: 'Pha Tương Tác',
    icon: '⚔️',
    description: 'Khi đứng cùng ô với người chơi khác, có thể chọn:',
    options: [
      {
        name: 'Hợp tác',
        detail:
          'Cả hai đồng ý → tổng mana chia đều. Số lẻ → người ít mana hơn nhận phần dư.',
      },
      {
        name: 'Chiến đấu',
        detail:
          'Cả hai tung xúc xắc → thua cuộc mất 1 mana cho người thắng và quay về ô xuất phát.',
      },
    ],
  },
  {
    id: 'endgame',
    title: 'Kết Thúc Game',
    icon: '🏆',
    description:
      'Game kết thúc khi tất cả vùng trên bản đồ bị phá hủy. Điểm được tính theo số mana mỗi người chơi có (1 mana = 1 điểm). Người chơi có nhiều điểm nhất chiến thắng!',
  },
];

export const SHOP_INFO = {
  name: 'ELARION',
  domain: 'elarion.id.vn',
  website: 'https://elarion.id.vn',
  email: 'contact@elarion.id.vn',
  fanpage: 'facebook.com/ElarionGame',
  instagram: 'instagram.com/elarion.game',
  phone: '',
  address: '',
  bankInfo: {
    bankName: '',
    accountNumber: '',
    accountHolder: 'ELARION GAME',
  },
};
