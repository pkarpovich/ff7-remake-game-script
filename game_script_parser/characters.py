from enum import Enum


class CharacterId(str, Enum):
    CLOUD = "CLOUD"
    TIFA = "TIFA"
    BARRET = "BARRET"
    AERITH = "AERITH"
    SEPHIROTH = "SEPHIROTH"
    RENO = "RENO"
    RUDE = "RUDE"
    TSENG = "TSENG"
    HOJO = "HOJO"
    PRESIDENT_SHINRA = "PRESIDENT_SHINRA"
    BIGGS = "BIGGS"
    MARLENE = "MARLENE"
    JESSIE = "JESSIE"
    WEDGE = "WEDGE"
    ZACK = "ZACK"
    BETTY = "BETTY"
    BECK = "BECK"
    ELMYRA = "ELMYRA"
    SAM = "SAM"
    SCOTCH = "SCOTCH"
    REEVE = "REEVE"
    ANDREA = "ANDREA"
    MADAME_M = "MADAME_M"
    DON_CORNEO = "DON_CORNEO"
    UNKNOWN = "UNKNOWN"


CHARACTER_MAPPING = {
    # Cloud
    "C": CharacterId.CLOUD,
    "Cloud": CharacterId.CLOUD,
    "К": CharacterId.CLOUD,
    "к": CharacterId.CLOUD,
    # Tifa
    "T": CharacterId.TIFA,
    "Т": CharacterId.TIFA,
    "т": CharacterId.TIFA,
    # Barret
    "B": CharacterId.BARRET,
    "Barrett": CharacterId.BARRET,
    # Aerith
    "A": CharacterId.AERITH,
    "А": CharacterId.AERITH,
    "Aerith": CharacterId.AERITH,
    # Turks
    "Reno": CharacterId.RENO,
    "Р": CharacterId.RENO,
    "R": CharacterId.RENO,
    "Rude": CharacterId.RUDE,
    "Tsen": CharacterId.TSENG,
    # Shinra
    "Hojo": CharacterId.HOJO,
    "H": CharacterId.HOJO,
    "Pres": CharacterId.PRESIDENT_SHINRA,
    # AVALANCHE
    "Big": CharacterId.BIGGS,
    "Вig": CharacterId.BIGGS,
    "В": CharacterId.BIGGS,
    "М": CharacterId.MARLENE,
    "M": CharacterId.MARLENE,
    "Mar": CharacterId.MARLENE,
    "Marl": CharacterId.MARLENE,
    "J": CharacterId.JESSIE,
    "W": CharacterId.WEDGE,
    # Others
    "Seph": CharacterId.SEPHIROTH,
    "S": CharacterId.SEPHIROTH,
    "Se": CharacterId.SEPHIROTH,
    "С": CharacterId.SEPHIROTH,
    "Зак": CharacterId.ZACK,
    "Be": CharacterId.BETTY,
    "Бек": CharacterId.BECK,
    "Elm": CharacterId.ELMYRA,
    "Sam": CharacterId.SAM,
    "Sco": CharacterId.SCOTCH,
    "Ree": CharacterId.REEVE,
    "Анд": CharacterId.ANDREA,
    "Мад": CharacterId.MADAME_M,
    "М М": CharacterId.MADAME_M,
    "M M": CharacterId.MADAME_M,
    # Misc
    "Дон": CharacterId.DON_CORNEO,
    # Special Cases
    "+": CharacterId.UNKNOWN,
    "++": CharacterId.UNKNOWN,
    "B+": CharacterId.UNKNOWN,
}
